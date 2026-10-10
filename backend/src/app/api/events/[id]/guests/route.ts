import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { EventMember } from '@/models/eventMember';
import { Guest } from '@/models/guest';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const createGuestSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  plusOne: z.number().default(0),
  side: z.enum(['BRIDE', 'GROOM', 'BOTH', 'FAMILY']).default('BOTH'),
  rsvp: z.enum(['YES', 'NO', 'MAYBE', 'PENDING']).default('PENDING'),
  accommodation: z.string().optional(),
  transportation: z.string().optional(),
  notes: z.string().optional(),
});

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];
    await getDb();

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const guests = await Guest.find({ eventId: eventId as any }).sort({ createdAt: -1 }).lean();
    const stats = {
      total: guests.length,
      confirmed: guests.filter(g => g.rsvp === 'YES').length,
      pending: guests.filter(g => g.rsvp === 'PENDING').length,
      declined: guests.filter(g => g.rsvp === 'NO').length,
      maybe: guests.filter(g => g.rsvp === 'MAYBE').length,
    };

    return NextResponse.json({
      stats,
      guests: guests.map(g => ({
        id: g._id.toString(),
        name: g.name,
        phone: g.phone,
        email: g.email,
        plusOne: g.plusOne,
        side: g.side,
        rsvp: g.rsvp,
        accommodation: g.accommodation,
        transportation: g.transportation,
        notes: g.notes,
      })),
    });
  } catch (error) {
    console.error('Get guests error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const data = createGuestSchema.parse(body);
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];

    await getDb();
    const guest = await Guest.create({
      ...data,
      eventId: eventId as any,
    });

    return NextResponse.json({
      guest: {
        id: guest._id.toString(),
        name: guest.name,
        phone: guest.phone,
        email: guest.email,
        plusOne: guest.plusOne,
        side: guest.side,
        rsvp: guest.rsvp,
        accommodation: guest.accommodation,
        transportation: guest.transportation,
        notes: guest.notes,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Create guest error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});