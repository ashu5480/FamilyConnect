import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { EventMember } from '@/models/eventMember';
import { Invitation } from '@/models/invitation';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const updateInvitationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  message: z.string().optional(),
  designId: z.string().optional(),
  allowRsvp: z.boolean().optional(),
  expiresAt: z.string().optional(),
});

function getIds(req: NextRequest) {
  const parts = req.nextUrl.pathname.split('/');
  return { eventId: parts[parts.length - 3], invitationId: parts[parts.length - 1] };
}

export const PATCH = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { eventId, invitationId } = getIds(req);
    const body = await req.json();
    const data = updateInvitationSchema.parse(body);

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const invitation = await Invitation.findOneAndUpdate(
      { _id: invitationId as any, eventId: eventId as any },
      { ...data, expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined },
      { new: true }
    ).lean();

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({
      invitation: {
        id: invitation._id.toString(),
        title: invitation.title,
        message: invitation.message,
        designId: invitation.designId?.toString(),
        shareLink: invitation.shareLink,
        allowRsvp: invitation.allowRsvp,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Update invitation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { eventId, invitationId } = getIds(req);

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const invitation = await Invitation.findOneAndDelete({ _id: invitationId as any, eventId: eventId as any });
    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete invitation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
