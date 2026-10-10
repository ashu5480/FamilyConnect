'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSite } from '@/components/gui/Providers';
import { AnimatedReveal } from '@/components/gui/AnimatedReveal';
import { AnimatedTypography } from '@/components/anim/AnimatedTypography';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useFamilyConnect } from '@/hooks/useFamilyConnect';
import Link from 'next/link';
import { Panel } from '@/components/HomeHero/Panel';

const STAGGER = {
  stager: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { stagger: { each: 0.08, from: 'first' }, delayChildren: 0.15 } },
  },
};

export function HomeHero() {
  const { reducedMotion } = useSite();
  const { events, loading } = useFamilyConnect();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-12%] left-[-8%] h-[50vw] w-[50vw] rounded-full bg-brand-200/30 blur-3xl"
          animate={{ scale: [1, 1.15, 1], x: [0, 24, 0], y: [0, -14, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-6%] h-[46vw] w-[46vw] rounded-full bg-sky-200/25 blur-3xl"
          animate={{ scale: [1.1, 1.3, 1.1], x: [0, -20, 0], y: [0, 18, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 h-[22vw] w-[22vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedReveal>
            <motion.div variants={STAGGER.stager}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur border border-ink-200 text-ink-600 text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 text-brand-500" />
                The calm place for family connection
              </div>

              <AnimatedTypography
                words={['Keep your', 'family in sync.']}
                variant="title"
                className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-[1.05] tracking-tight"
              />

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mt-6 max-w-xl text-lg text-ink-500 leading-relaxed"
              >
                Members share moments, plan events, and stay aligned around a
                private family hub — no noise, just quiet connection.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Button size="lg" asChild>
                  <Link href="/family">
                    Join a family
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/family">View how it works</Link>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatedReveal>

          <AnimatedReveal delay={120}>
            <Panel events={events} loading={loading} />
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
