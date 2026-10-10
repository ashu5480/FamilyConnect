import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { EventMember } from '@/models/eventMember';
import { Media } from '@/models/media';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { createMediaStorage } from '@/services/mediaStorage';

const uploadSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().min(1),
  type: z.enum(['IMAGE', 'VIDEO']),
  albumId: z.string().optional(),
  caption: z.string().optional(),
});

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];
    await getDb();

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const media = await Media.find({ eventId: eventId as any }).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ media: media.map(m => ({
      id: m._id.toString(),
      type: m.type,
      url: m.url,
      thumbnailUrl: m.thumbnailUrl,
      originalUrl: m.originalUrl,
      processedUrl: m.processedUrl,
      mimeType: m.mimeType,
      width: m.width,
      height: m.height,
      size: m.size,
      filename: m.filename,
      caption: m.caption,
      isTransparent: m.isTransparent,
      storageProvider: m.storageProvider,
      createdAt: m.createdAt,
    })) });
  } catch (error) {
    console.error('Get media error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const data = uploadSchema.parse(body);
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];

    await getDb();
    const storage = createMediaStorage();

    const uploadResult = await storage.upload(
      Buffer.from(''),
      data.filename,
      data.mimeType
    );

    const media = await Media.create({
      eventId: eventId as any,
      albumId: data.albumId as any,
      userId: req.user!.userId,
      type: data.type,
      url: uploadResult.url,
      originalUrl: uploadResult.url,
      mimeType: data.mimeType,
      size: data.size,
      filename: data.filename,
      caption: data.caption,
      isTransparent: false,
      storageProvider: uploadResult.provider,
    });

    return NextResponse.json({
      media: {
        id: media._id.toString(),
        type: media.type,
        url: media.url,
        originalUrl: media.originalUrl,
        mimeType: media.mimeType,
        size: media.size,
        filename: media.filename,
        caption: media.caption,
        isTransparent: media.isTransparent,
        storageProvider: media.storageProvider,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Upload media error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});