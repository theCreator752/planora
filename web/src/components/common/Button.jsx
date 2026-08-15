import React from 'react';

const VARIANTS = {
  primary:
    'bg-dusk-500 text-white hover:bg-dusk-600 disabled:bg-dusk-300 dark:disabled:bg-dusk-800',
  secondary:
    'bg-mist-200 text-ink-900 hover:bg-mist-300 dark:bg-night-700 dark:text-mist-100 dark:hover:bg-night-600',
  ghost:
    'bg-transparent text-ink-800 hover:bg-mist-200 dark:text-mist-200 dark:hover:bg-night-700',
  danger: 'bg-transparent text-red-600 hover:bg-red-50 dark:hover:bg-red-950',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium
        transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
