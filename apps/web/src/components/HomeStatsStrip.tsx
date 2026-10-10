'use client';

import { useSite } from '@/components/gui/Providers';
import { AnimatedReveal } from '@/components/gui/AnimatedReveal';

export function StatsStrip() {
  const { reducedMotion } = useSite();

  const stats = [
    { value: '30+', label: 'families connected' },
    { value: '1,200+', label: 'members across families' },
    { value: '48', label: 'events planned this week' },
    { value: '100%', label: 'private & secure' },
  ];

  if (reducedMotion) {
    return (
      <AnimatedReveal className="border-y border-ink-200 bg-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-display font-bold text-ink-900">{s.value}</p>
                <p className="mt-1 text-sm text-ink-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedReveal>
    );
  }

  return (
    <AnimatedReveal className="border-y border-ink-200 bg-white">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={s.label} className="stat-item">
              <p className="text-3xl font-display font-bold text-ink-900">{s.value}</p>
              <p className="mt-1 text-sm text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedReveal>
  );
}
