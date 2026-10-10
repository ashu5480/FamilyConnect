import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Notification } from '@/models/notification';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await getDb();
    const notifications = await Notification.find({ userId: req.user!.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ notifications: notifications.map(n => ({
      id: n._id.toString(),
      familyId: n.familyId?.toString(),
      eventId: n.eventId?.toString(),
      type: n.type,
      title: n.title,
      body: n.body,
      data: n.data,
      isRead: n.isRead,
      readAt: n.readAt,
      createdAt: n.createdAt,
    })) });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await getDb();
    const notifications = await Notification.updateMany(
      { userId: req.user!.userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return NextResponse.json({ success: true, marked: notifications.modifiedCount });
  } catch (error) {
    console.error('Mark notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});