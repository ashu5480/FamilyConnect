import { forwardRef, LabelHTMLAttributes } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', htmlFor, children, ...props }, ref) => (
    <label ref={ref} htmlFor={htmlFor} className={`label ${className}`} {...props}>
      {children}
    </label>
  )
);

Label.displayName = 'Label';
