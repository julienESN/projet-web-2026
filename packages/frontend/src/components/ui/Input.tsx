import type { InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  /** Pour textarea, passer as="textarea" */
  as?: 'input' | 'textarea';
}

const baseInput =
  'w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed';

export function Input({
  label,
  error,
  as = 'input',
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id ?? (label ? `input-${label.replace(/\s/g, '-').toLowerCase()}` : undefined);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      {as === 'textarea' ? (
        <textarea
          id={inputId}
          className={`${baseInput} min-h-[100px] resize-y ${className}`}
          {...(props as React.ComponentProps<'textarea'>)}
        />
      ) : (
        <input
          id={inputId}
          className={`${baseInput} ${className}`}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <span className="text-sm text-[var(--color-error)]">{error}</span>}
    </div>
  );
}
