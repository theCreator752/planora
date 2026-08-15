import { api } from './client.js';

export function getTasksForDate(date) {
  return api.get(`/tasks?date=${date}`);
}

export function createTask({ title, description, date, priority }) {
  return api.post('/tasks', { title, description, date, priority });
}

export function updateTask(id, updates) {
  return api.put(`/tasks/${id}`, updates);
}

export function deleteTask(id) {
  return api.delete(`/tasks/${id}`);
}
