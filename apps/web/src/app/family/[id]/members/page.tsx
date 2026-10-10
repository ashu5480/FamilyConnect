'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { useFamilyConnect } from '@/hooks/useFamilyConnect';
import { Family, Member } from '@/lib/types';

export default function FamilyMembersPage() {
  const params = useParams();
  const familyId = params.id as string;
  const { families, members, loadMembers } = useFamilyConnect();
  const family = families.find((f) => f.id === familyId);
  const list = family != null ? [{ id: 'demo', familyId: family.id, name: family.name, role: 'Host', color: family.color }] : [];

  const openParent = () => {
    if (typeof window === 'undefined') return;
    window.history.back();
  };

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Button variant="ghost" size="sm" onClick={openParent} className="mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Members</h1>
          <p className="text-ink-500 mt-1">{list.length} people in this family hub.</p>
        </div>
        <Button asChild>
          <Link href={`/family/${familyId}/events`}>
            <Plus className="h-4 w-4" />
            Add a member
          </Link>
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 text-center text-ink-500">No members yet.</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m: Member) => (
            <Card key={m.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar name={m.name} size="lg" />
                <div>
                  <p className="font-semibold text-ink-900">{m.name}</p>
                  <p className="text-sm text-ink-500">{m.role}</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
