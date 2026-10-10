import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { POST as registerPOST } from '@/app/api/auth/register/route';
import { POST as loginPOST } from '@/app/api/auth/login/route';
import { User } from '@/models/user';
import { Family } from '@/models/family';
import { FamilyMember } from '@/models/familyMember';

let mongo: MongoMemoryServer;

function makeRequest(body: unknown, rawBody?: string): NextRequest {
  const payload = rawBody ?? JSON.stringify(body);
  return new NextRequest('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  });
}

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), { dbName: 'familyconnect-test' });
}, 120000);

afterEach(async () => {
  await User.deleteMany({});
  await Family.deleteMany({});
  await FamilyMember.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('POST /api/auth/register', () => {
  it('rejects malformed JSON with 400 (not 500)', async () => {
    const res = await registerPOST(makeRequest(null, '{invalid'));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid JSON body');
  });

  it('rejects missing/invalid fields with 400', async () => {
    const res = await registerPOST(makeRequest({ name: '', email: 'nope', password: 'x' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Validation failed');
  });

  it('creates user + family + ADMIN membership and returns tokens', async () => {
    const res = await registerPOST(
      makeRequest({ name: 'Test User', email: 'Test@Example.com', password: 'TestPass123!' })
    );
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.user.email).toBe('test@example.com');
    expect(json.family.slug).toBeDefined();
    expect(json.accessToken).toBeDefined();
    expect(json.refreshToken).toBeDefined();

    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).not.toBeNull();
    const member = await FamilyMember.findOne({ userId: user!._id, status: 'ACTIVE' });
    expect(member?.role).toBe('ADMIN');
  });

  it('returns 409 for a duplicate email', async () => {
    const payload = { name: 'Test User', email: 'dup@example.com', password: 'TestPass123!' };
    expect((await registerPOST(makeRequest(payload))).status).toBe(201);
    const second = await registerPOST(makeRequest(payload));
    expect(second.status).toBe(409);
    expect((await second.json()).error).toBe('Email already registered');
  });

  it('does not leak secrets or stack traces on unexpected failures', async () => {
    const spy = jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('boom'));
    const res = await registerPOST(
      makeRequest({ name: 'X', email: 'x@y.com', password: 'TestPass123!' })
    );
    expect(res.status).toBe(500);
    const text = JSON.stringify(await res.json());
    expect(text).not.toMatch(/boom|MONGODB|JWT|token/i);
    spy.mockRestore();
  });

  it('does not leave a partial user when family creation fails', async () => {
    const spy = jest.spyOn(Family, 'create').mockRejectedValueOnce(new Error('family down'));
    const res = await registerPOST(
      makeRequest({ name: 'Partial', email: 'partial@example.com', password: 'TestPass123!' })
    );
    expect(res.status).toBe(500);
    expect(await User.findOne({ email: 'partial@example.com' })).toBeNull();
    spy.mockRestore();
  });
});

describe('POST /api/auth/login', () => {
  const creds = { name: 'Login User', email: 'login@example.com', password: 'TestPass123!' };

  beforeEach(async () => {
    const res = await registerPOST(makeRequest(creds));
    expect(res.status).toBe(201);
  });

  it('returns the auth contract for valid credentials', async () => {
    const res = await loginPOST(
      makeRequest({ email: creds.email, password: creds.password })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.user.email).toBe(creds.email);
    expect(json.accessToken).toBeDefined();
    expect(json.refreshToken).toBeDefined();
  });

  it('rejects wrong passwords with 401 (no user enumeration detail)', async () => {
    const res = await loginPOST(makeRequest({ email: creds.email, password: 'WrongPass1!' }));
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('Invalid email or password');
  });

  it('rejects malformed JSON with 400', async () => {
    const res = await loginPOST(makeRequest(null, '{invalid'));
    expect(res.status).toBe(400);
  });
});
