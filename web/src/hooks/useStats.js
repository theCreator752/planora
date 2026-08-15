import { useQuery } from '@tanstack/react-query';
import * as statsApi from '../api/stats.js';

export function useMonthStats(year, month) {
  return useQuery({
    queryKey: ['stats', 'month', year, month],
    queryFn: () => statsApi.getMonthStats(year, month),
  });
}

export function useYearStats(year) {
  return useQuery({
    queryKey: ['stats', 'year', year],
    queryFn: () => statsApi.getYearStats(year),
  });
}

export function useSummary() {
  return useQuery({
    queryKey: ['stats', 'summary'],
    queryFn: () => statsApi.getSummary(),
  });
}
