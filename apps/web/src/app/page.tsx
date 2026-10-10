'use client';

import { HomeHero } from '@/components/HomeHero';
import { StatsStrip } from '@/components/HomeStatsStrip';
import { FamilyRow } from '@/components/HomeFamilyRow';
import { EventsStrip } from '@/components/HomeEventsStrip';
import { ScrollScene } from '@/components/HomeScrollScene';
import { useFamilyConnect } from '@/hooks/useFamilyConnect';

export default function HomePage() {
  const { families, events, loading } = useFamilyConnect();

  // Tailor the demo content so the homepage reads like real FamilyConnect data.
  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 antialiased overflow-hidden">
      <HomeHero />
      <StatsStrip />
      <FamilyRow families={families} />
      <EventsStrip events={events} />
      <ScrollScene />
    </div>
  );
}
