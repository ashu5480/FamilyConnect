import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { EventMember } from '@/models/eventMember';
import { Channel } from '@/models/channel';
import { Message } from '@/models/message';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const sendMessageSchema = z.object({
  channelId: z.string(),
  content: z.string().min(1).max(2000),
  type: z.enum(['TEXT', 'IMAGE', 'FILE']).default('TEXT'),
  parentMessageId: z.string().optional(),
});

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];
    await getDb();

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const messages = await Message.find({ eventId: eventId as any }).sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ messages: messages.reverse().map(m => ({
      id: m._id.toString(),
      content: m.content,
      type: m.type,
      createdAt: m.createdAt,
      channelId: m.channelId.toString(),
      userId: m.userId.toString(),
      parentMessageId: m.parentMessageId?.toString(),
      reactions: m.reactions,
      isDeleted: m.isDeleted,
    })) });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const data = sendMessageSchema.parse(body);
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];

    await getDb();
    const message = await Message.create({
      ...data,
      eventId: eventId as any,
      userId: req.user!.userId,
      mentions: [],
      attachments: [],
      reactions: [],
      isDeleted: false,
    });

    return NextResponse.json({
      message: {
        id: message._id.toString(),
        content: message.content,
        type: message.type,
        createdAt: message.createdAt,
        channelId: message.channelId.toString(),
        userId: message.userId.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});