import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { EventMember } from '@/models/eventMember';
import { Task } from '@/models/task';
import { Schedule } from '@/models/schedule';
import { Guest } from '@/models/guest';
import { AIConversation } from '@/models/aiConversation';
import { AIMessage } from '@/models/aiMessage';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationId: z.string().optional(),
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const data = chatSchema.parse(body);
    const eventId = req.nextUrl.pathname.split('/').slice(-3)[0];

    await getDb();

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let conversation = data.conversationId
      ? await AIConversation.findOne({ _id: data.conversationId, eventId: eventId as any, userId: req.user!.userId })
      : null;

    if (!conversation) {
      conversation = await AIConversation.create({
        eventId: eventId as any,
        userId: req.user!.userId,
        title: data.message.slice(0, 50),
      });
    }

    await AIMessage.create({
      conversationId: conversation._id,
      role: 'USER',
      content: data.message,
    });

    const [tasks, schedule, guests] = await Promise.all([
      Task.find({ eventId: eventId as any }).lean(),
      Schedule.find({ eventId: eventId as any }).sort({ date: 1 }).lean(),
      Guest.find({ eventId: eventId as any }).lean(),
    ]);

    const context = {
      tasks: tasks.map(t => ({ title: t.title, status: t.status, priority: t.priority })),
      schedule: schedule.map(s => ({ name: s.name, date: s.date, startTime: s.startTime, location: s.location })),
      guests: guests.map(g => ({ name: g.name, rsvp: g.rsvp })),
    };

    const aiResponse = generateAIResponse(data.message, context);

    await AIMessage.create({
      conversationId: conversation._id,
      role: 'ASSISTANT',
      content: aiResponse,
    });

    return NextResponse.json({
      conversationId: conversation._id.toString(),
      message: {
        role: 'ASSISTANT',
        content: aiResponse,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

function generateAIResponse(message: string, context: any): string {
  const lower = message.toLowerCase();

  if (lower.includes('pending') && lower.includes('task')) {
    const pending = context.tasks.filter((t: any) => t.status === 'TODO' || t.status === 'IN_PROGRESS');
    if (pending.length === 0) return 'All tasks are completed! Great work.';
    return `Here are the pending tasks:\n\n${pending.map((t: any) => `• ${t.title} (${t.status})`).join('\n')}`;
  }

  if (lower.includes('when') || lower.includes('schedule') || lower.includes('mehndi') || lower.includes('haldi') || lower.includes('sangeet') || lower.includes('wedding')) {
    if (context.schedule.length === 0) return 'No schedule items found for this event.';
    return `Here's the event schedule:\n\n${context.schedule.map((s: any) => `• ${s.name} - ${new Date(s.date).toLocaleDateString()} at ${new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${s.location ? ` (${s.location})` : ''}`).join('\n')}`;
  }

  if (lower.includes('rsvp') || lower.includes('guest') || lower.includes('invited') || lower.includes('confirmed')) {
    const confirmed = context.guests.filter((g: any) => g.rsvp === 'YES').length;
    const pending = context.guests.filter((g: any) => g.rsvp === 'PENDING').length;
    const declined = context.guests.filter((g: any) => g.rsvp === 'NO').length;
    return `RSVP Summary:\n\n• Confirmed: ${confirmed}\n• Pending: ${pending}\n• Declined: ${declined}\n• Total: ${context.guests.length}`;
  }

  if (lower.includes('checklist') || lower.includes('tomorrow')) {
    return `Here's a checklist for tomorrow:\n\n• Review final guest list\n• Confirm vendor arrivals\n• Check decoration setup\n• Prepare welcome drinks\n• Verify seating arrangements\n• Confirm photography timeline`;
  }

  return `I can help you with:\n\n• "What tasks are still pending?"\n• "When is the wedding?"\n• "Who hasn't RSVP'd?"\n• "Create a checklist for tomorrow"\n\nAsk me anything about your event!`;
}