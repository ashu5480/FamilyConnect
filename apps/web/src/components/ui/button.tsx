import {
  forwardRef,
  ButtonHTMLAttributes,
  ElementType,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  asChild?: boolean;
  component?: ElementType;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  secondary: 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50 hover:border-ink-300',
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-100',
  danger: 'bg-danger-500 text-white hover:bg-danger-600',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      fullWidth,
      asChild = false,
      component,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild || component ? (component ?? 'button') : 'button';

    // `asChild` renders a child element as the button (compound component pattern).
    // Without extra deps we only support a single React element child.
    if (asChild) {
      if (!isValidElement<{ className?: string; children?: ReactNode }>(children)) {
        return <Comp ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props} />;
      }
      const child = cloneElement(children, {
        className: `${children.props.className ?? ''} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''}`.trim(),
        ...props,
      });
      return <Comp ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}>{child}</Comp>;
    }

    return (
      <Comp
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
