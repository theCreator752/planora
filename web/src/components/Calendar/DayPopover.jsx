import React from 'react';
import Modal from '../common/Modal.jsx';
import TaskList from '../Tasks/TaskList.jsx';
import { useTasksForDate } from '../../hooks/useTasks.js';
import { formatDayLabel } from '../../utils/date.js';

export default function DayPopover({ date, onClose }) {
  const { data } = useTasksForDate(date);
  const tasks = data?.tasks || [];
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted).length;
  const percent = total === 0 ? null : Math.round((completed / total) * 100);

  return (
    <Modal isOpen={!!date} onClose={onClose} title={date ? formatDayLabel(date) : ''}>
      <div className="mb-3 flex items-center justify-between text-sm text-ink-700 dark:text-mist-300">
        <span>
          {total === 0 ? 'No tasks scheduled' : `${completed} of ${total} completed`}
        </span>
        {percent !== null && <span className="font-semibold tabular">{percent}%</span>}
      </div>
      {date && <TaskList date={date} />}
    </Modal>
  );
}
