import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Media } from '@/models/media';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await getDb();
    const cutouts = await Media.find({
      userId: req.user!.userId,
      isTransparent: true,
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ cutouts: cutouts.map(c => ({
      id: c._id.toString(),
      url: c.url,
      processedUrl: c.processedUrl,
      originalUrl: c.originalUrl,
      mimeType: c.mimeType,
      width: c.width,
      height: c.height,
      size: c.size,
      filename: c.filename,
      caption: c.caption,
      createdAt: c.createdAt,
    })) });
  } catch (error) {
    console.error('Get cutouts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const cutoutId = req.nextUrl.searchParams.get('id');
    if (!cutoutId) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const result = await Media.findOneAndDelete({
      _id: cutoutId as any,
      userId: req.user!.userId,
      isTransparent: true,
    });

    if (!result) {
      return NextResponse.json({ error: 'Cutout not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete cutout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});