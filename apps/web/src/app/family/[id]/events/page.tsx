'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFamilyConnect } from '@/hooks/useFamilyConnect';
import { EventItem } from '@/lib/types';

export default function FamilyEventsPage() {
  const params = useParams();
  const familyId = params.id as string;
  const { events, loadEvents } = useFamilyConnect();

  const goBack = () => {
    if (typeof window === 'undefined') return;
    window.history.back();
  };

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Button variant="ghost" size="sm" onClick={goBack} className="mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Events</h1>
          <p className="text-ink-500 mt-1">Calendar for {familyId}.</p>
        </div>
        <Button asChild>
          <Link href="/events">
            <Plus className="h-4 w-4" />
            Add event
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="mt-6 text-center text-ink-500">No events yet.</div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: EventItem) => (
            <Card key={event.id} className="hover:shadow-elevated transition-shadow duration-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-brand-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-brand-500" />
                    </div>
                    <div>
                      <p className="font-medium text-ink-900">{event.title}</p>
                      <p className="text-sm text-ink-500">{event.location}</p>
                    </div>
                  </div>
                  <Badge variant="brand">{event.type}</Badge>
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm text-ink-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {event.time}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    {event.date}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
