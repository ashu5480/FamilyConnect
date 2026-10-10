'use client';

import { motion, MotionProps, useTransform } from 'framer-motion';
import { usePageScroll } from '@/hooks/usePageScroll';

export interface ParallaxCardProps extends MotionProps {
  children: React.ReactNode;
  offset?: number;
  strength?: number;
  style?: React.CSSProperties;
}

/**
 * Scroll-linked parallax. The whole card is a 3D container; background layers
 * move faster and foreground layers move slower. Harmless when reduced-motion.
 */
export function ParallaxCard({
  children,
  offset = 0,
  strength = 14,
  style,
  ...props
}: ParallaxCardProps) {
  const { scrollY } = usePageScroll();
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const rotateX = useTransform(scrollY, [0, vh], [0, strength]);
  const rotateY = useTransform(scrollY, [0, vh], [0, strength * 1.6]);

  return (
    <motion.div
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
      {...props}
    >
      {/* Background — stronger parallax */}
      <div
        style={{
          transform: `translateZ(${offset}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformOrigin: 'center bottom',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
