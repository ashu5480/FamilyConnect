import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { User } from '@/models/user';
import { FamilyMember } from '@/models/familyMember';
import { comparePassword, generateTokens } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  try {
    const { email, password } = loginSchema.parse(body);

    await getDb();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const member = await FamilyMember.findOne({ userId: user._id, status: 'ACTIVE' });
    const familyId = member?.familyId?.toString();
    const role = member?.role;

    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      familyId,
      role,
    });

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, relationship: user.relationship, profilePhoto: user.profilePhoto },
      family: familyId ? { id: familyId } : null,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = (error as unknown as { errors?: unknown; issues?: unknown }).errors
        ?? (error as unknown as { issues?: unknown }).issues;
      return NextResponse.json({ error: 'Validation failed', details }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Login error:', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}