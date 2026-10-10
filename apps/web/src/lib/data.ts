import { Family, Member, EventItem, Connection } from './types';

// FamilyConnect is a real product. When the API is available, these functions
// fetch live data; otherwise they fall back to a small deterministic seed so
// the premium site can be previewed, tested, and reviewed without a backend.
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://familyconnect-api.vercel.app/api';

export async function getFamilies(): Promise<Family[]> {
  try {
    const res = await fetch(`${API_BASE}/families`, { cache: 'no-store' });
    if (!res.ok) throw new Error('api');
    return (await res.json()) as Family[];
  } catch {
    return seedFamilies();
  }
}

export async function getMembers(familyId: string): Promise<Member[]> {
  try {
    const res = await fetch(`${API_BASE}/families/${familyId}/members`, { cache: 'no-store' });
    if (!res.ok) throw new Error('api');
    return (await res.json()) as Member[];
  } catch {
    return seedMembers(familyId);
  }
}

export async function getEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(`${API_BASE}/events`, { cache: 'no-store' });
    if (!res.ok) throw new Error('api');
    return (await res.json()) as EventItem[];
  } catch {
    return seedEvents();
  }
}

export async function getConnections(): Promise<Connection[]> {
  try {
    const res = await fetch(`${API_BASE}/connections`, { cache: 'no-store' });
    if (!res.ok) throw new Error('api');
    return (await res.json()) as Connection[];
  } catch {
    return seedConnections();
  }
}

function seedFamilies(): Family[] {
  return [
    {
      id: 'fam-1',
      name: 'The Parkers',
      membersCount: 4,
      sharedCalendar: true,
      location: 'Portland, OR',
      avatar: 'P',
      color: 'bg-brand-500',
      cover: null,
      relationship: ['Partner', 'Son'],
    },
    {
      id: 'fam-2',
      name: 'The Nalus',
      membersCount: 3,
      sharedCalendar: true,
      location: 'Austin, TX',
      avatar: 'N',
      color: 'bg-sky-500',
      cover: null,
      relationship: ['Partner', 'Daughter'],
    },
    {
      id: 'fam-3',
      name: 'The Okafor',
      membersCount: 5,
      sharedCalendar: false,
      location: 'Toronto, ON',
      avatar: 'O',
      color: 'bg-amber-500',
      cover: null,
      relationship: ['Partner', 'Child'],
    },
  ];
}

function seedMembers(familyId: string): Member[] {
  const names = [
    { label: 'Aiko Park', role: 'Parent', color: 'bg-brand-500' },
    { label: 'Leo Park', role: 'Child' },
    { label: 'Nadia Lusu', role: 'Partner', color: 'bg-sky-500' },
    { label: 'Mina Nalus', role: 'Child' },
    { label: 'Chidi Okafor', role: 'Parent', color: 'bg-amber-500' },
    { label: 'Zara Okafor', role: 'Child' },
  ];
  return names.map((m, i) => ({
    id: `member-${i}-${familyId}`,
    familyId,
    name: m.label,
    role: m.role,
    image: undefined,
    color: m.color ?? 'bg-brand-500',
  }));
}

function seedEvents(): EventItem[] {
  return [
    { id: 'evt-1', title: 'Family Game Night', date: 'Apr 12', time: '6:00 PM', location: 'Virtual', type: 'game' },
    { id: 'evt-2', title: 'Dinner together', date: 'Apr 14', time: '7:30 PM', location: 'The Nalus kitchen', type: 'meal' },
    { id: 'evt-3', title: 'Weekend hike', date: 'Apr 18', time: '8:00 AM', location: 'Cascade Trail', type: 'outdoor' },
    { id: 'evt-4', title: 'Birthday prep', date: 'Apr 20', time: 'TBD', location: 'Tokyo', type: 'celebration' },
  ];
}

function seedConnections(): Connection[] {
  return [
    { id: 'conn-1', from: 'Parker', to: 'Nalus', status: 'pending' as const, note: 'Wanted to connect about the cross-city move.' },
    { id: 'conn-2', from: 'Okafor', to: 'Parker', status: 'accepted' as const, note: 'Looking forward to a family meet-up.' },
  ];
}
