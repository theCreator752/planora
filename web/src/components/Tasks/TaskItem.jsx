import React, { useState } from 'react';
import PriorityBadge from './PriorityBadge.jsx';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(task);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <li className="group flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-mist-100 dark:hover:bg-night-700">
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" ${task.isCompleted ? 'incomplete' : 'complete'}`}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-mist-300 text-dusk-500 focus:ring-dusk-400 dark:border-night-600"
      />
      <button className="min-w-0 flex-1 text-left" onClick={() => onEdit(task)}>
        <p
          className={`truncate text-sm font-medium ${
            task.isCompleted ? 'text-ink-700 line-through dark:text-mist-400' : ''
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 truncate text-xs text-ink-700 dark:text-mist-400">
            {task.description}
          </p>
        )}
        <div className="mt-1">
          <PriorityBadge priority={task.priority} />
        </div>
      </button>
      <button
        onClick={handleDelete}
        disabled={deleting}
        aria-label={`Delete "${task.title}"`}
        className="rounded-full p-1 text-ink-700 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus-visible:opacity-100 dark:text-mist-400 dark:hover:bg-red-950"
      >
        ✕
      </button>
    </li>
  );
}
