import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { EventMember } from '@/models/eventMember';
import { Schedule } from '@/models/schedule';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const createScheduleSchema = z.object({
  name: z.string().min(1).max(200),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  organizer: z.string().optional(),
  participants: z.array(z.string()).optional(),
  reminder: z.number().optional(),
});

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];
    await getDb();

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const schedule = await Schedule.find({ eventId: eventId as any }).sort({ date: 1, startTime: 1 }).lean();
    return NextResponse.json({ schedule: schedule.map(s => ({
      id: s._id.toString(),
      name: s.name,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      location: s.location,
      description: s.description,
      organizer: s.organizer?.toString(),
      participants: s.participants.map(p => p.toString()),
      reminder: s.reminder,
    })) });
  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const data = createScheduleSchema.parse(body);
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];

    await getDb();
    const schedule = await Schedule.create({
      ...data,
      eventId: eventId as any,
      date: new Date(data.date),
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
      participants: data.participants || [],
    });

    return NextResponse.json({
      schedule: {
        id: schedule._id.toString(),
        name: schedule.name,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        location: schedule.location,
        description: schedule.description,
        organizer: schedule.organizer?.toString(),
        participants: schedule.participants.map(p => p.toString()),
        reminder: schedule.reminder,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Create schedule error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});