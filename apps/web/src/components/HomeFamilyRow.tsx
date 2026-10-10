'use client';

import { useSite } from '@/components/gui/Providers';
import { AnimatedReveal } from '@/components/gui/AnimatedReveal';
import { AnimatedTypography } from '@/components/anim/AnimatedTypography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Family } from '@/lib/types';
import Link from 'next/link';

export function FamilyRow({ families }: { families: Family[] }) {
  const { reducedMotion } = useSite();

  if (reducedMotion) {
    return (
      <AnimatedReveal className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <AnimatedTypography words={['Real', 'families', 'in', 'the', 'real', 'world.']} variant="subtitle" />
          <p className="mt-3 max-w-xl mx-auto text-ink-500">
            A glimpse of how the Parkers and the Nalus stay connected.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {families.map((family) => (
            <Card key={family.id} className="overflow-hidden hover:shadow-elevated transition-shadow duration-300">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex items-center justify-center h-11 w-11 rounded-xl text-white font-bold ${family.color}`}>
                    {family.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-base">{family.name}</CardTitle>
                    <Badge variant="brand">{family.membersCount} members</Badge>
                  </div>
                </div>
                <p className="text-sm text-ink-500">{family.location}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {family.relationship.slice(0, 2).map((r) => (
                    <Badge key={r} variant="default">{r}</Badge>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/family/${family.id}`}>Open hub</Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/family/${family.id}/members`}>Members</Link>
                  </Button>
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
      <div className="text-center">
        <AnimatedTypography words={['Real', 'families', 'in', 'the', 'real', 'world.']} variant="subtitle" />
        <p className="mt-3 max-w-xl mx-auto text-ink-500">
          A glimpse of how the Parkers and the Nalus stay connected.
        </p>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {families.map((family, i) => (
          <AnimatedReveal key={family.id} delay={i * 80}>
            <Card className="overflow-hidden hover:shadow-elevated transition-shadow duration-300">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex items-center justify-center h-11 w-11 rounded-xl text-white font-bold ${family.color}`}>
                    {family.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-base">{family.name}</CardTitle>
                    <Badge variant="brand">{family.membersCount} members</Badge>
                  </div>
                </div>
                <p className="text-sm text-ink-500">{family.location}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {family.relationship.slice(0, 2).map((r) => (
                    <Badge key={r} variant="default">{r}</Badge>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/family/${family.id}`}>Open hub</Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/family/${family.id}/members`}>Members</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedReveal>
        ))}
      </div>
    </AnimatedReveal>
  );
}
