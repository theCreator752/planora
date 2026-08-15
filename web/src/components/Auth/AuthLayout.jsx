import React from 'react';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist-100 px-4 dark:bg-night-900">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl2 bg-dusk-500 text-lg text-white">
            🔥
          </div>
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-ink-700 dark:text-mist-300">{subtitle}</p>
          )}
        </div>
        <div className="rounded-xl2 bg-white p-6 shadow-soft dark:bg-night-800 dark:border dark:border-night-600">
          {children}
        </div>
      </div>
    </div>
  );
}
