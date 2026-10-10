'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Calendar, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { useFamilyConnect } from '@/hooks/useFamilyConnect';
import { Family, Member, EventItem } from '@/lib/types';

export default function FamilyDetailPage() {
  const params = useParams();
  const familyId = params.id as string;
  const { families, members, events, loadMembers } = useFamilyConnect();
  const family = families.find((f) => f.id === familyId);

  const goBack = () => {
    if (typeof window === 'undefined') return;
    window.history.back();
  };

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {family ? (
        <>
          <Button variant="ghost" size="sm" onClick={goBack} className="mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{family.name}</CardTitle>
                  <div className="flex items-center gap-3 mt-1 text-sm text-ink-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {family.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {family.membersCount} members
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {family.relationship.map((r) => (
                      <Badge key={r} variant="default">{r}</Badge>
                    ))}
                  </div>
                </div>
                <Avatar name={family.name} size="lg" />
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-ink-600">
                  A private shared space for {family.name.toLowerCase()}. Plan
                  together, share moments, and stay in sync across everyone&apos;s
                  schedule.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {events.slice(0, 2).map((event) => (
                    <Card key={event.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-brand-500" />
                        </div>
                        <div>
                          <p className="font-medium text-ink-900 text-sm">{event.title}</p>
                          <p className="text-xs text-ink-500">{event.date} · {event.time}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Button asChild>
                  <Link href={`/family/${family.id}/members`}>View all members</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Members</CardTitle>
                <CardDescription>People in this family hub.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {family.relationship.map((role) => (
                  <div key={role} className="flex items-center gap-3">
                    <Avatar name={family.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-ink-900">{family.name}</p>
                      <p className="text-xs text-ink-500">{role}</p>
                    </div>
                    <Badge variant="brand" className="ml-auto">{family.membersCount}</Badge>
                  </div>
                ))}
              </CardContent>
              <CardContent className="border-t border-ink-100 pt-3">
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4" />
                  Message hub
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-ink-500">Family not found.</p>
        </div>
      )}
    </div>
  );
}
