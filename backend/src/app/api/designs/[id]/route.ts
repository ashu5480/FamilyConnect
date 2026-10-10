import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { Design } from '@/models/design';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const updateDesignSchema = z.object({
  name: z.string().min(1).max(200).optional(),
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
  })).optional(),
  previewUrl: z.string().optional(),
});

export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const designId = req.nextUrl.pathname.split('/').pop()!;
    const body = await req.json();
    const data = updateDesignSchema.parse(body);

    await getDb();
    const design = await Design.findOneAndUpdate(
      { _id: designId, userId: req.user!.userId },
      data,
      { new: true }
    );

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

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
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Update design error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const designId = req.nextUrl.pathname.split('/').pop()!;
    await getDb();

    const design = await Design.findOneAndDelete({
      _id: designId,
      userId: req.user!.userId,
    });

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete design error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});