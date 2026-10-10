import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { EventMember } from '@/models/eventMember';
import { Document } from '@/models/document';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { createMediaStorage } from '@/services/mediaStorage';

const createDocumentSchema = z.object({
  title: z.string().min(1).max(200),
  mimeType: z.string().min(1),
  size: z.number().min(1),
  filename: z.string().min(1),
  category: z.string().min(1),
});

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];
    await getDb();

    const member = await EventMember.findOne({ eventId: eventId as any, userId: req.user!.userId });
    if (!member) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const documents = await Document.find({ eventId: eventId as any }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ documents: documents.map(d => ({
      id: d._id.toString(),
      title: d.title,
      url: d.url,
      originalUrl: d.originalUrl,
      mimeType: d.mimeType,
      size: d.size,
      filename: d.filename,
      category: d.category,
      createdAt: d.createdAt,
    })) });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const data = createDocumentSchema.parse(body);
    const eventId = req.nextUrl.pathname.split('/').slice(-2)[0];

    await getDb();
    const storage = createMediaStorage();

    const uploadResult = await storage.upload(
      Buffer.from(''),
      data.filename,
      data.mimeType
    );

    const document = await Document.create({
      eventId: eventId as any,
      userId: req.user!.userId,
      title: data.title,
      url: uploadResult.url,
      originalUrl: uploadResult.url,
      mimeType: data.mimeType,
      size: data.size,
      filename: data.filename,
      category: data.category,
    });

    return NextResponse.json({
      document: {
        id: document._id.toString(),
        title: document.title,
        url: document.url,
        mimeType: document.mimeType,
        size: document.size,
        filename: document.filename,
        category: document.category,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Create document error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});