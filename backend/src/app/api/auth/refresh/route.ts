import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { User } from '@/models/user';
import { FamilyMember } from '@/models/familyMember';
import { generateTokens, verifyRefreshToken, TokenPayload } from '@/lib/auth';

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  try {
    const { refreshToken } = refreshSchema.parse(body);

    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    await getDb();
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const member = await FamilyMember.findOne({ userId: user._id, status: 'ACTIVE' });
    const familyId = member?.familyId?.toString();
    const role = member?.role;

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      familyId,
      role,
    });

    return NextResponse.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = (error as unknown as { errors?: unknown; issues?: unknown }).errors
        ?? (error as unknown as { issues?: unknown }).issues;
      return NextResponse.json({ error: 'Validation failed', details }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Refresh error:', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
