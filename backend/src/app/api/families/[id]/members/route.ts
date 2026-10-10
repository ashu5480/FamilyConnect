import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { FamilyMember } from '@/models/familyMember';
import { User } from '@/models/user';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const familyId = req.nextUrl.pathname.split('/').slice(-2)[0];
    await getDb();

    const membership = await FamilyMember.findOne({
      familyId: familyId as any,
      userId: req.user!.userId,
      status: 'ACTIVE',
    });
    if (!membership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const members = await FamilyMember.find({ familyId: familyId as any, status: 'ACTIVE' })
      .sort({ joinedAt: 1 })
      .lean();

    const memberDetails = await Promise.all(
      members.map(async (m) => {
        const user = await User.findById(m.userId).select('name email phone relationship profilePhoto').lean();
        return {
          id: m._id.toString(),
          role: m.role,
          status: m.status,
          joinedAt: m.joinedAt,
          user: user
            ? {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                relationship: user.relationship,
                profilePhoto: user.profilePhoto,
              }
            : null,
        };
      })
    );

    return NextResponse.json({ members: memberDetails });
  } catch (error) {
    console.error('Get family members error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
