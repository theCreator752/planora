import React, { useState } from 'react';
import { useTasksForDate, useCreateTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasks.js';
import TaskItem from './TaskItem.jsx';
import QuickAddTask from './QuickAddTask.jsx';
import TaskModal from './TaskModal.jsx';
import Spinner from '../common/Spinner.jsx';
import { fireCompletionConfetti } from '../../utils/confetti.js';

export default function TaskList({ date }) {
  const { data, isLoading } = useTasksForDate(date);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [editingTask, setEditingTask] = useState(null);

  const tasks = data?.tasks || [];

  async function handleAdd(title) {
    await createTask.mutateAsync({ title, description: '', date, priority: 'med' });
  }

  async function handleToggle(task) {
    const nextCompleted = !task.isCompleted;
    await updateTask.mutateAsync({ id: task._id, updates: { isCompleted: nextCompleted } });

    if (nextCompleted) {
      const allDone = tasks.every((t) => (t._id === task._id ? true : t.isCompleted));
      if (allDone && tasks.length > 0) fireCompletionConfetti();
    }
  }

  async function handleDelete(task) {
    await deleteTask.mutateAsync({ id: task._id, date: task.date });
  }

  async function handleSaveEdit(task, form) {
    await updateTask.mutateAsync({ id: task._id, updates: form });
  }

  return (
    <div>
      <QuickAddTask onAdd={handleAdd} />

      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : tasks.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-700 dark:text-mist-400">
            Nothing planned yet — add your first task above.
          </p>
        ) : (
          <ul className="divide-y divide-mist-200 dark:divide-night-700">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onEdit={setEditingTask}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </div>

      <TaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
