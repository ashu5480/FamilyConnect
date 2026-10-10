'use client';

import Link from 'next/link';
import { Plus, Calendar, Clock, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useSite } from '@/components/gui/Providers';
import { AnimatedReveal } from '@/components/gui/AnimatedReveal';
import { EventItem } from '@/lib/types';
import { getEvents } from '@/lib/data';

const TYPES: Record<EventItem['type'], { label: string; color: string }> = {
  game: { label: 'Game', color: 'bg-brand-100 text-brand-600' },
  meal: { label: 'Meal', color: 'bg-sky-100 text-sky-600' },
  outdoor: { label: 'Outdoor', color: 'bg-emerald-100 text-emerald-600' },
  celebration: { label: 'Celebration', color: 'bg-amber-100 text-amber-600' },
};

export default function EventsPage() {
  const { reducedMotion } = useSite();
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getEvents().then((list) => {
      if (!active) return;
      setItems(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  if (reducedMotion && !loading) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Events</h1>
            <p className="text-ink-500 mt-1">Calendar for all families.</p>
          </div>
          <Button asChild>
            <Link href="#add">
              <Plus className="h-4 w-4" />
              Add event
            </Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((event) => (
            <Card key={event.id}>
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
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.location}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Events</h1>
          <p className="text-ink-500 mt-1">Calendar for all families.</p>
        </div>
        <Button asChild>
          <Link href="#add">
            <Plus className="h-4 w-4" />
            Add event
          </Link>
        </Button>
      </div>

      <AnimatedReveal className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((event, idx) => (
          <AnimatedReveal key={event.id} delay={idx * 80}>
            <Card className="hover:shadow-elevated transition-shadow duration-300">
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
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.location}
                  </span>
                </div>
              </CardContent>
            </Card>
          </AnimatedReveal>
        ))}
      </AnimatedReveal>
    </div>
  );
}
