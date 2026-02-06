import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}

      <input
        {...rest}
        className={`rounded-lg border px-2 py-2 outline-none foucus:ring-2 w-full ${className ?? ''}`}
      />

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
