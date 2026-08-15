import React from 'react';

const CONFIG = {
  low: { color: 'bg-mist-300 dark:bg-night-600', label: 'Low' },
  med: { color: 'bg-dusk-400', label: 'Med' },
  high: { color: 'bg-flame-500', label: 'High' },
};

export default function PriorityBadge({ priority }) {
  const cfg = CONFIG[priority] || CONFIG.med;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink-700 dark:text-mist-300">
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.color}`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}
