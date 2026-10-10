import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Invitation } from '@/models/invitation';
import { Guest } from '@/models/guest';
import { z } from 'zod';

const rsvpSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  rsvp: z.enum(['YES', 'NO', 'MAYBE']),
  plusOne: z.number().default(0),
});

export async function GET(req: NextRequest) {
  try {
    const shareLink = req.nextUrl.pathname.split('/').pop()!;
    await getDb();

    const invitation = await Invitation.findOne({ shareLink });
    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({
      invitation: {
        id: invitation._id.toString(),
        eventId: invitation.eventId.toString(),
        title: invitation.title,
        message: invitation.message,
        allowRsvp: invitation.allowRsvp,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error('Get invitation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const shareLink = req.nextUrl.pathname.split('/').pop()!;
    const body = await req.json();
    const data = rsvpSchema.parse(body);

    await getDb();
    const invitation = await Invitation.findOne({ shareLink });
    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    if (!invitation.allowRsvp) {
      return NextResponse.json({ error: 'RSVP is not allowed for this invitation' }, { status: 403 });
    }

    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 410 });
    }

    const guest = await Guest.create({
      eventId: invitation.eventId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      plusOne: data.plusOne,
      rsvp: data.rsvp,
      side: 'BOTH',
    });

    return NextResponse.json({
      success: true,
      guest: {
        id: guest._id.toString(),
        name: guest.name,
        rsvp: guest.rsvp,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('RSVP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}