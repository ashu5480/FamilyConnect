import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { User } from '@/models/user';
import { FamilyMember } from '@/models/familyMember';
import { Family } from '@/models/family';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await getDb();
    const user = await User.findById(req.user!.userId).select('-passwordHash');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const member = await FamilyMember.findOne({ userId: user._id, status: 'ACTIVE' });
    let family = null;
    if (member) {
      family = await Family.findById(member.familyId);
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        relationship: user.relationship,
        profilePhoto: user.profilePhoto,
      },
      family: family ? {
        id: family._id.toString(),
        name: family.name,
        slug: family.slug,
      } : null,
      role: member?.role || null,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { name, phone, relationship, profilePhoto } = body;

    await getDb();
    const user = await User.findByIdAndUpdate(req.user!.userId, {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(relationship !== undefined && { relationship }),
      ...(profilePhoto !== undefined && { profilePhoto }),
    }, { new: true }).select('-passwordHash');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        relationship: user.relationship,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
