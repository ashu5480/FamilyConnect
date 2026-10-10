'use client';

import { ReactNode, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { useSite } from './Providers';

interface AnimatedRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  reanimate?: boolean;
  y?: number;
  opacity?: number;
  viewport?: {
    once?: boolean;
    margin?: string;
  };
}

function makeVariants(y: number, opacity: number, reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: { opacity, y: 0 },
      visible: { opacity, y: 0 },
    };
  }
  return {
    hidden: { opacity: 0, y },
    visible: { opacity, y: 0 },
  };
}

export function AnimatedReveal({
  children,
  className = '',
  delay = 0,
  reanimate = false,
  y = 24,
  opacity = 1,
  viewport = { once: true, margin: '-80px' },
}: AnimatedRevealProps) {
  const { reducedMotion } = useSite();
  const variants = useMemo(() => makeVariants(y, opacity, reducedMotion), [y, opacity, reducedMotion]);

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}
