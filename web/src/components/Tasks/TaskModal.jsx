import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'med', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function TaskModal({ isOpen, task, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', description: '', date: '', priority: 'med' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        date: task.date || '',
        priority: task.priority || 'med',
      });
    }
  }, [task]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(task, form);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-title" className="mb-1 block text-sm font-medium">
            Title
          </label>
          <input
            id="task-title"
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm
              focus:border-dusk-400 dark:border-night-600 dark:bg-night-700 dark:text-mist-100"
          />
        </div>
        <div>
          <label htmlFor="task-description" className="mb-1 block text-sm font-medium">
            Description <span className="font-normal text-ink-700 dark:text-mist-400">(optional)</span>
          </label>
          <textarea
            id="task-description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm
              focus:border-dusk-400 dark:border-night-600 dark:bg-night-700 dark:text-mist-100"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="task-date" className="mb-1 block text-sm font-medium">
              Date
            </label>
            <input
              id="task-date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm
                focus:border-dusk-400 dark:border-night-600 dark:bg-night-700 dark:text-mist-100"
            />
          </div>
          <div>
            <label htmlFor="task-priority" className="mb-1 block text-sm font-medium">
              Priority
            </label>
            <select
              id="task-priority"
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
              className="w-full rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm
                focus:border-dusk-400 dark:border-night-600 dark:bg-night-700 dark:text-mist-100"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
