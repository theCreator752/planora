import React from 'react';

export default function StatTile({ label, value, suffix = '', icon }) {
  return (
    <div className="rounded-xl2 border border-mist-200 p-4 dark:border-night-700">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-ink-700 dark:text-mist-400">
        {icon && <span aria-hidden="true">{icon}</span>}
        {label}
      </div>
      <div className="font-display text-2xl font-semibold tabular">
        {value}
        {suffix}
      </div>
    </div>
  );
}
