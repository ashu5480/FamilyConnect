import { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'sector' | 'brand' | 'verified' | 'pending' | 'suspended';
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-ink-100 text-ink-700',
  sector: 'bg-ink-100 text-ink-700',
  brand: 'bg-brand-50 text-brand-600',
  verified: 'bg-ink-100 text-ink-600',
  pending: 'bg-warning-50 text-warning-500',
  suspended: 'bg-danger-50 text-danger-500',
};

export function Badge({ children, className = '', variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
