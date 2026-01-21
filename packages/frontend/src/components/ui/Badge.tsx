type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  size?: BadgeSize;
  /** Couleur de fond (CSS ou variable). Ex: var(--color-link), #3B82F6 */
  color?: string;
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({
  children,
  size = 'md',
  color,
  className = '',
  style,
  ...props
}: BadgeProps) {
  const defaultStyle = color ? { backgroundColor: color, color: '#fff' } : undefined;
  
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${!color ? 'bg-[var(--color-border)] text-[var(--color-text-muted)]' : ''}
        ${sizeStyles[size]}
        ${className}
      `}
      style={{ ...defaultStyle, ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
