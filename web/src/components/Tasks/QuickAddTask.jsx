import React, { useState } from 'react';

export default function QuickAddTask({ onAdd }) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setTitle('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task and press Enter…"
        aria-label="New task title"
        className="flex-1 rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm text-ink-900
          focus:border-dusk-400 dark:border-night-600 dark:bg-night-700 dark:text-mist-100"
      />
      <button
        type="submit"
        disabled={submitting || !title.trim()}
        aria-label="Add task"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dusk-500 text-white
          hover:bg-dusk-600 disabled:opacity-50"
      >
        +
      </button>
    </form>
  );
}
