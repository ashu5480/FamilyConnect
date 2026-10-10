'use client';

import { Calendar, MapPin } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { EventItem } from '@/lib/types';

export function Panel({ events, loading }: { events: EventItem[]; loading: boolean }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 -translate-x-1/2 rotate-3 rounded-2xl bg-gradient-to-br from-brand-100 via-amber-50 to-sky-100 opacity-60 blur-xl" />
      <div className="relative rounded-2xl border border-ink-200 bg-white p-5 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Avatar name="Aiko Park" size="md" />
          <div>
            <p className="text-sm font-semibold text-ink-900">The Parkers</p>
            <p className="text-xs text-ink-500">Shared calendar active</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-3 w-full animate-pulse rounded bg-ink-100" />
            <div className="h-3 w-[75%] animate-pulse rounded bg-ink-100" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-ink-100 hover:bg-ink-50 transition-colors"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-brand-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-brand-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{event.title}</p>
                    <p className="text-xs text-ink-500">
                      {event.date} · {event.time} · {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-ink-400">
              <MapPin className="h-3.5 w-3.5" />
              <span>Your family is already connected.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
