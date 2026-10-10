import { ReactNode } from 'react';

export interface GradientTextProps {
  children: ReactNode;
  className?: string;
  length?: 'short' | 'long';
}

export function GradientText({ children, className = '', length = 'long' }: GradientTextProps) {
  const gradient =
    length === 'long'
      ? 'bg-gradient-to-r from-brand-400 via-brand-500 to-sky-400'
      : 'bg-gradient-to-r from-brand-400 to-brand-500';

  return (
    <span
      className={`bg-clip-text text-transparent ${gradient} ${className}`}
    >
      {children}
    </span>
  );
}
