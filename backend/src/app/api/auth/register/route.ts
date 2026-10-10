import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { User } from '@/models/user';
import { FamilyMember } from '@/models/familyMember';
import { Family } from '@/models/family';
import { hashPassword, comparePassword, generateTokens } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().optional(),
  relationship: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, relationship } = registerSchema.parse(body);

    await getDb();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      phone,
      relationship,
    });

    const familyName = `${name}'s Family`;
    const slug = familyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + user._id.toString().slice(-6);
    const family = await Family.create({
      name: familyName,
      slug,
      createdBy: user._id,
    });

    await FamilyMember.create({
      familyId: family._id,
      userId: user._id,
      role: 'ADMIN',
      status: 'ACTIVE',
      joinedAt: new Date(),
    });

    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      familyId: family._id.toString(),
      role: 'ADMIN',
    });

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, relationship: user.relationship, profilePhoto: user.profilePhoto },
      family: { id: family._id, name: family.name, slug: family.slug },
      accessToken,
      refreshToken,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}