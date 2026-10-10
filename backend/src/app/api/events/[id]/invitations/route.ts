import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { EventMember } from '@/models/eventMember';
import { Invitation } from '@/models/invitation';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const createInvitationSchema = z.object({
  title: z.string().min(1).max(200),
  message: z.string().optional(),
  designId: z.string().optional(),
  allowRsvp: z.boolean().default(true),
  expiresAt: z.string().optional(),
});

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];
    await getDb();

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const invitations = await Invitation.find({ eventId: eventId as any }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ invitations: invitations.map(i => ({
      id: i._id.toString(),
      title: i.title,
      message: i.message,
      designId: i.designId?.toString(),
      shareLink: i.shareLink,
      allowRsvp: i.allowRsvp,
      expiresAt: i.expiresAt,
      createdBy: i.createdBy.toString(),
      createdAt: i.createdAt,
    })) });
  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const data = createInvitationSchema.parse(body);
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];

    await getDb();
    const shareLink = `invite-${Math.random().toString(36).slice(2, 10)}`;

    const invitation = await Invitation.create({
      ...data,
      eventId: eventId as any,
      shareLink,
      createdBy: req.user!.userId,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    });

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
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Create invitation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});