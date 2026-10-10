'use client';

import { useMemo, useState } from 'react';

export interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  resetOnLeave?: boolean;
  onTiltStart?: () => void;
  onTiltEnd?: () => void;
}

/**
 * A 3D tilt card. Tracks only the horizontal pointer delta (and the last
 * known Y on touch), so mobile never feels jumpy when the pointer moves.
 *
 * `speed` controls the tilt extent in degrees. `resetOnLeave` snaps the card
 * back to neutral when the pointer exits — set false for a sustained tilt.
 */
export function TiltCard({
  children,
  className = '',
  speed = 8,
  resetOnLeave = true,
  onTiltStart,
  onTiltEnd,
}: TiltCardProps) {
  const [depth, setDepth] = useState({ x: 0, y: 0 });

  const transform = useMemo(() => {
    if (resetOnLeave && depth.x === 0 && depth.y === 0) {
      return 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    }
    return `perspective(1000px) rotateY(${depth.x * speed}deg) rotateX(${depth.y * -speed}deg) translateZ(12px)`;
  }, [depth, speed, resetOnLeave]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setDepth({ x, y });
    if (onTiltStart) onTiltStart();
  };

  const onLeave = () => {
    if (resetOnLeave) setDepth({ x: 0, y: 0 });
    if (onTiltEnd) onTiltEnd();
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        if (!touch) return;
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;
        setDepth({ x, y });
        if (onTiltStart) onTiltStart();
      }}
      onTouchEnd={onLeave}
      style={{ transform, transformStyle: 'preserve-3d' }}
      className={`transition-transform duration-150 will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
