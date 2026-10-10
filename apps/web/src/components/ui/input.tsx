import { forwardRef, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', id, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <Label htmlFor={id}>{label}</Label>}
        <input
          ref={ref}
          id={id}
          className={`input ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Label = forwardRef<HTMLLabelElement, { htmlFor?: string; children: React.ReactNode }>(
  ({ htmlFor, children }, ref) => (
    <label ref={ref} htmlFor={htmlFor} className="label">
      {children}
    </label>
  )
);

Label.displayName = 'Label';
