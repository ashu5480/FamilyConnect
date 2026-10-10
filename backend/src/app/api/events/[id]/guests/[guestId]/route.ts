import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { EventMember } from '@/models/eventMember';
import { Guest } from '@/models/guest';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const updateGuestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  plusOne: z.number().optional(),
  side: z.enum(['BRIDE', 'GROOM', 'BOTH', 'FAMILY']).optional(),
  rsvp: z.enum(['YES', 'NO', 'MAYBE', 'PENDING']).optional(),
  accommodation: z.string().optional(),
  transportation: z.string().optional(),
  notes: z.string().optional(),
});

function getIds(req: NextRequest) {
  const parts = req.nextUrl.pathname.split('/');
  return { eventId: parts[parts.length - 3], guestId: parts[parts.length - 1] };
}

export const PATCH = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { eventId, guestId } = getIds(req);
    const body = await req.json();
    const data = updateGuestSchema.parse(body);

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const guest = await Guest.findOneAndUpdate(
      { _id: guestId as any, eventId: eventId as any },
      data,
      { new: true }
    ).lean();

    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    return NextResponse.json({
      guest: {
        id: guest._id.toString(),
        name: guest.name,
        phone: guest.phone,
        email: guest.email,
        plusOne: guest.plusOne,
        side: guest.side,
        rsvp: guest.rsvp,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Update guest error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { eventId, guestId } = getIds(req);

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const guest = await Guest.findOneAndDelete({ _id: guestId as any, eventId: eventId as any });
    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete guest error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
