import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Event } from '@/models/event';
import { EventMember } from '@/models/eventMember';
import { FamilyMember } from '@/models/familyMember';
import { Task } from '@/models/task';
import { Schedule } from '@/models/schedule';
import { Guest } from '@/models/guest';
import { Media } from '@/models/media';
import { Channel } from '@/models/channel';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const eventId = req.nextUrl.pathname.split('/').pop()!;
    await getDb();

    const event = await Event.findById(eventId).lean();
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const member = await EventMember.findOne({ eventId: event._id, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [tasks, schedule, guests, media, channels] = await Promise.all([
      Task.find({ eventId: event._id }).lean(),
      Schedule.find({ eventId: event._id }).sort({ date: 1 }).lean(),
      Guest.find({ eventId: event._id }).lean(),
      Media.find({ eventId: event._id }).sort({ createdAt: -1 }).limit(12).lean(),
      Channel.find({ eventId: event._id }).lean(),
    ]);

    return NextResponse.json({
      event: {
        id: event._id.toString(),
        name: event.name,
        type: event.type,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        description: event.description,
        coverImage: event.coverImage,
        familyId: event.familyId.toString(),
        createdBy: event.createdBy.toString(),
      },
      member: { role: member.role },
      stats: {
        members: 0,
        photos: media.length,
        tasks: tasks.length,
        guests: guests.length,
        chats: channels.length,
      },
      tasks: tasks.map(t => ({
        id: t._id.toString(),
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
      })),
      schedule: schedule.map(s => ({
        id: s._id.toString(),
        name: s.name,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        location: s.location,
      })),
      guests: guests.map(g => ({
        id: g._id.toString(),
        name: g.name,
        rsvp: g.rsvp,
        side: g.side,
      })),
      channels: channels.map(c => ({
        id: c._id.toString(),
        name: c.name,
        slug: c.slug,
      })),
      recentMedia: media.map(m => ({
        id: m._id.toString(),
        url: m.url,
        type: m.type,
        thumbnailUrl: m.thumbnailUrl,
      })),
    });
  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});