import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

const variants = {
  primary: 'bg-accent text-accent-fg hover:bg-accent/90 shadow-sm',
  secondary: 'border border-line bg-surface-2 text-fg hover:border-fg-3/50 hover:bg-surface-2/70',
  outline: 'border border-line text-fg hover:bg-surface-2',
  ghost: 'text-fg-2 hover:bg-surface-2 hover:text-fg',
  danger: 'bg-danger text-white hover:bg-danger/90',
};
const sizes = {
  sm: 'h-8 gap-1.5 px-3 text-[0.8125rem]',
  md: 'h-9 gap-2 px-4 text-[0.875rem]',
  lg: 'h-11 gap-2 px-6 text-[0.9375rem]',
};

export const buttonStyles = ({ variant = 'secondary', size = 'md', className } = {}) =>
  cn(
    'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-md font-medium',
    'transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  );

/** `as` lets a Button render as a router <Link> or <a> while keeping the same styles. */
const Button = forwardRef(function Button(
  { as: Tag = 'button', variant, size, loading, leftIcon, icon, rightIcon: Right, className, children, disabled, ...props },
  ref,
) {
  const Left = leftIcon || icon;
  const isButton = Tag === 'button';
  return (
    <Tag
      ref={ref}
      className={buttonStyles({ variant, size, className })}
      disabled={isButton ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      {...(isButton ? { type: props.type || 'button' } : {})}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : Left && <Left className="h-4 w-4" aria-hidden />}
      {children}
      {!loading && Right && <Right className="h-4 w-4" aria-hidden />}
    </Tag>
  );
});

export default Button;
