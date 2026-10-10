import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';
import { User } from '@/models/user';
import { FamilyMember } from '@/models/familyMember';
import { Family } from '@/models/family';
import { hashPassword, generateTokens } from '@/lib/auth';

export const runtime = 'nodejs';

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().optional(),
  relationship: z.string().optional(),
});

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 11000
  );
}

export async function POST(req: NextRequest) {
  // Parse the body exactly once. A missing/incorrect Content-Type or a
  // non-JSON payload otherwise throws inside `req.json()` and surfaces as
  // a generic 500; return a controlled 400 instead.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  try {
    const { name, email, password, phone, relationship } = registerSchema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    await getDb();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    // Track created documents so a failure part-way through registration
    // cannot leave a half-created account behind.
    const createdUser = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      phone,
      relationship,
    });

    try {
      const familyName = `${name}'s Family`;
      const slug =
        familyName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') +
        '-' +
        createdUser._id.toString().slice(-6);
      const family = await Family.create({
        name: familyName,
        slug,
        createdBy: createdUser._id,
      });

      try {
        await FamilyMember.create({
          familyId: family._id,
          userId: createdUser._id,
          role: 'ADMIN',
          status: 'ACTIVE',
          joinedAt: new Date(),
        });
      } catch (memberError) {
        // Compensate: family without its admin membership is unusable.
        await Family.deleteOne({ _id: family._id }).catch(() => undefined);
        throw memberError;
      }

      const { accessToken, refreshToken } = generateTokens({
        userId: createdUser._id.toString(),
        email: createdUser.email,
        familyId: family._id.toString(),
        role: 'ADMIN',
      });

      return NextResponse.json({
        user: { id: createdUser._id, name: createdUser.name, email: createdUser.email, phone: createdUser.phone, relationship: createdUser.relationship, profilePhoto: createdUser.profilePhoto },
        family: { id: family._id, name: family.name, slug: family.slug },
        accessToken,
        refreshToken,
      }, { status: 201 });
    } catch (innerError) {
      // Compensate: user without a family/membership is a partial account.
      await User.deleteOne({ _id: createdUser._id }).catch(() => undefined);
      throw innerError;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = (error as unknown as { errors?: unknown; issues?: unknown }).errors
        ?? (error as unknown as { issues?: unknown }).issues;
      return NextResponse.json({ error: 'Validation failed', details }, { status: 400 });
    }
    if (isDuplicateKeyError(error)) {
      // Race between the findOne check above and insert (or a retry after a
      // partial failure) surfaces as Mongo duplicate key — report 409.
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Register error:', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}