import { ReactNode } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
  children?: ReactNode;
  imgSrc?: string;
}

const sizes: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-lg',
};

export function Avatar({ name, size = 'md', className = '', imgSrc, children }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase() || 'U';

  const hasImg = typeof imgSrc === 'string' && imgSrc.length > 0;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold ${sizes[size]} ${hasImg ? 'overflow-hidden' : ''} ${className}`}
      aria-label={name}
    >
      {hasImg && imgSrc && (
        <img src={imgSrc} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
      )}
      {!hasImg && children ? (
        children
      ) : (
        <span className="leading-tight">{initials || 'U'}</span>
      )}
    </div>
  );
}
