'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedReveal } from '@/components/gui/AnimatedReveal';
import { AnimatedTypography } from '@/components/anim/AnimatedTypography';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Calendar, Zap } from 'lucide-react';
import Link from 'next/link';
import { ParallaxCard } from '@/components/anim/ParallaxCard';
import { useSite } from '@/components/gui/Providers';

// ScrollTrigger powers the cinematic, scroll-scrubbed card reveal below.
// Registered once on the client; the animation is skipped under reduced-motion.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollScene() {
  const sceneRef = useRef<HTMLElement>(null);
  const { reducedMotion } = useSite();

  useEffect(() => {
    if (reducedMotion) return;
    const root = sceneRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.scene-grid > *',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: root,
            start: 'top 78%',
            end: 'top 35%',
            scrub: 1,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="scroll-scene" ref={sceneRef}>
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedReveal>
          <div className="text-center">
            <AnimatedTypography words={['One hub,', 'one place,', 'always connected.']} variant="title" />
            <p className="mt-3 max-w-xl mx-auto text-ink-500">
              When the world feels heavy, the family pulse keeps steady.
            </p>
          </div>
        </AnimatedReveal>

        <div className="mt-12 grid md:grid-cols-3 gap-6 scene-grid">
          <ParallaxCard offset={-16} strength={16}>
            <div className="relative h-56 rounded-card border border-ink-200 bg-gradient-to-br from-ink-100 to-ink-200 p-5 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-inner">
                  <MessageSquare className="h-7 w-7 text-brand-500" />
                </div>
                <p className="mt-4 font-semibold text-ink-900">Connect</p>
                <p className="text-sm text-ink-500">Send a message</p>
              </div>
            </div>
          </ParallaxCard>
          <ParallaxCard offset={-16} strength={16}>
            <div className="relative h-56 rounded-card border border-ink-200 bg-gradient-to-br from-ink-100 to-ink-200 p-5 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-inner">
                  <Calendar className="h-7 w-7 text-sky-500" />
                </div>
                <p className="mt-4 font-semibold text-ink-900">Celebrate</p>
                <p className="text-sm text-ink-500">Plan an event</p>
              </div>
            </div>
          </ParallaxCard>
          <ParallaxCard offset={-16} strength={16}>
            <div className="relative h-56 rounded-card border border-ink-200 bg-gradient-to-br from-ink-100 to-ink-200 p-5 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-inner">
                  <Zap className="h-7 w-7 text-amber-500" />
                </div>
                <p className="mt-4 font-semibold text-ink-900">Remember</p>
                <p className="text-sm text-ink-500">Mark a milestone</p>
              </div>
            </div>
          </ParallaxCard>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/family">
              Open your family hub
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
