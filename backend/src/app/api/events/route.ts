import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { Event } from '@/models/event';
import { EventMember } from '@/models/eventMember';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const createEventSchema = z.object({
  familyId: z.string(),
  name: z.string().min(1).max(200),
  type: z.enum(['Wedding', 'Engagement', 'Birthday', 'Anniversary', 'Pooja', 'Housewarming', 'Baby Shower', 'Family Reunion', 'Other']),
  coverImage: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await getDb();
    const events = await Event.find({ createdBy: req.user!.userId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ events: events.map(e => ({
      id: e._id.toString(),
      name: e.name,
      type: e.type,
      startDate: e.startDate,
      endDate: e.endDate,
      location: e.location,
      coverImage: e.coverImage,
      familyId: e.familyId.toString(),
    })) });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const data = createEventSchema.parse(body);

    await getDb();
    const event = await Event.create({
      ...data,
      familyId: data.familyId as any,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      createdBy: req.user!.userId,
    });

    await EventMember.create({
      eventId: event._id,
      userId: req.user!.userId,
      role: 'ORGANIZER',
    });

    return NextResponse.json({
      event: {
        id: event._id.toString(),
        name: event.name,
        type: event.type,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        coverImage: event.coverImage,
        familyId: event.familyId.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});