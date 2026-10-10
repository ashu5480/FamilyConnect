'use client';

import { useSite } from '@/components/gui/Providers';
import { AnimatedReveal } from '@/components/gui/AnimatedReveal';
import { AnimatedTypography } from '@/components/anim/AnimatedTypography';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { EventItem } from '@/lib/types';

export function EventsStrip({ events }: { events: EventItem[] }) {
  const { reducedMotion } = useSite();

  if (reducedMotion) {
    return (
      <AnimatedReveal className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold">This week&apos;s family events</h2>
            <p className="text-ink-500 mt-1">All in one shared calendar.</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/events">View all events</Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-brand-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-brand-500" />
                    </div>
                    <div>
                      <p className="font-medium text-ink-900">{event.title}</p>
                      <p className="text-xs text-ink-500">{event.location}</p>
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
      </AnimatedReveal>
    );
  }

  return (
    <AnimatedReveal className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">This week&apos;s family events</h2>
          <p className="text-ink-500 mt-1">All in one shared calendar.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/events">View all events</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {events.map((event, idx) => (
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
                      <p className="text-xs text-ink-500">{event.location}</p>
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
      </div>
    </AnimatedReveal>
  );
}
