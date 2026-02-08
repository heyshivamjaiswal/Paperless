import type { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-white/70">{label}</label>
      )}

      <input
        {...rest}
        className={`rounded-xl border px-4 py-2.5 outline-none 
                  transition-all duration-200 w-full
                  focus:scale-[1.01] focus:ring-2 focus:ring-offset-0
                  ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
                  ${className ?? ''}`}
      />

      {error && (
        <motion.span
          className="text-xs text-red-400"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.span>
      )}
    </div>
  );
}
