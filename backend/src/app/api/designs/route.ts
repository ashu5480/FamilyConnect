import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { Design } from '@/models/design';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const createDesignSchema = z.object({
  eventId: z.string().optional(),
  name: z.string().min(1).max(200),
  type: z.enum(['INVITATION', 'EVENT_COVER']),
  template: z.string().optional(),
  background: z.string().optional(),
  elements: z.array(z.object({
    type: z.enum(['TEXT', 'IMAGE']),
    content: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    rotation: z.number().default(0),
    opacity: z.number().default(1),
    fontSize: z.number().optional(),
    color: z.string().optional(),
    fontFamily: z.string().optional(),
    textAlign: z.enum(['left', 'center', 'right']).optional(),
    zIndex: z.number().default(0),
  })).default([]),
  previewUrl: z.string().optional(),
});

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await getDb();
    const designs = await Design.find({ userId: req.user!.userId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ designs: designs.map(d => ({
      id: d._id.toString(),
      eventId: d.eventId?.toString(),
      name: d.name,
      type: d.type,
      template: d.template,
      background: d.background,
      elements: d.elements,
      previewUrl: d.previewUrl,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    })) });
  } catch (error) {
    console.error('Get designs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const data = createDesignSchema.parse(body);

    await getDb();
    const design = await Design.create({
      ...data,
      userId: req.user!.userId,
    });

    return NextResponse.json({
      design: {
        id: design._id.toString(),
        eventId: design.eventId?.toString(),
        name: design.name,
        type: design.type,
        template: design.template,
        background: design.background,
        elements: design.elements,
        previewUrl: design.previewUrl,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Create design error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});