import React, { useState } from 'react';
import { useTasksForDate, useCreateTask } from '../../hooks/useTasks.js';
import { yesterdayStr, todayStr } from '../../utils/date.js';
import Button from '../common/Button.jsx';

export default function RolloverNudge() {
  const yesterday = yesterdayStr();
  const today = todayStr();
  const { data } = useTasksForDate(yesterday);
  const createTask = useCreateTask();
  const [dismissed, setDismissed] = useState(false);
  const [carrying, setCarrying] = useState(false);

  const missed = (data?.tasks || []).filter((t) => !t.isCompleted);

  if (dismissed || missed.length === 0) return null;

  async function handleCarryForward() {
    setCarrying(true);
    try {
      await Promise.all(
        missed.map((t) =>
          createTask.mutateAsync({
            title: t.title,
            description: t.description,
            date: today,
            priority: t.priority,
          })
        )
      );
      setDismissed(true);
    } finally {
      setCarrying(false);
    }
  }

  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-xl2 bg-dusk-50 px-4 py-3 text-sm dark:bg-dusk-900/40">
      <p className="text-ink-800 dark:text-mist-200">
        You had <strong>{missed.length}</strong> task{missed.length === 1 ? '' : 's'} left over
        from yesterday. Carry {missed.length === 1 ? 'it' : 'them'} forward to today?
      </p>
      <div className="flex shrink-0 gap-2">
        <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
          Dismiss
        </Button>
        <Button size="sm" onClick={handleCarryForward} disabled={carrying}>
          Carry forward
        </Button>
      </div>
    </div>
  );
}
