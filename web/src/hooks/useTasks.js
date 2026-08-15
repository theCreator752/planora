import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as tasksApi from '../api/tasks.js';

export function useTasksForDate(date) {
  return useQuery({
    queryKey: ['tasks', date],
    queryFn: () => tasksApi.getTasksForDate(date),
    enabled: !!date,
  });
}

// Invalidate both the day's task list and any stats views that derive from
// it, since a single create/update/delete can change completion % for the
// month/year heatmap and the summary dashboard.
function useInvalidateAfterMutation() {
  const queryClient = useQueryClient();
  return (date) => {
    queryClient.invalidateQueries({ queryKey: ['tasks', date] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
  };
}

export function useCreateTask() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: (data, variables) => invalidate(variables.date),
  });
}

export function useUpdateTask() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: ({ id, updates }) => tasksApi.updateTask(id, updates),
    onSuccess: (data) => invalidate(data?.task?.date),
  });
}

export function useDeleteTask() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: ({ id }) => tasksApi.deleteTask(id),
    onSuccess: (data, variables) => invalidate(variables.date),
  });
}
