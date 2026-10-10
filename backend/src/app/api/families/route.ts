import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { Family } from '@/models/family';
import { FamilyMember } from '@/models/familyMember';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const createFamilySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await getDb();
    const members = await FamilyMember.find({ userId: req.user!.userId, status: 'ACTIVE' });
    const familyIds = members.map(m => m.familyId);
    const families = await Family.find({ _id: { $in: familyIds } }).lean();

    const result = families.map(f => ({
      id: f._id.toString(),
      name: f.name,
      slug: f.slug,
      description: f.description,
      coverImage: f.coverImage,
      role: members.find(m => m.familyId.toString() === f._id.toString())?.role,
    }));

    return NextResponse.json({ families: result });
  } catch (error) {
    console.error('Get families error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { name, description } = createFamilySchema.parse(body);

    await getDb();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6);
    const family = await Family.create({
      name,
      slug,
      description,
      createdBy: req.user!.userId,
    });

    await FamilyMember.create({
      familyId: family._id,
      userId: req.user!.userId,
      role: 'ADMIN',
      status: 'ACTIVE',
      joinedAt: new Date(),
    });

    return NextResponse.json({
      family: {
        id: family._id.toString(),
        name: family.name,
        slug: family.slug,
        description: family.description,
      },
      role: 'ADMIN',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Create family error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});