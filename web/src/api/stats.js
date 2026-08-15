import { api } from './client.js';

export function getMonthStats(year, month) {
  return api.get(`/stats/month?year=${year}&month=${String(month).padStart(2, '0')}`);
}

export function getYearStats(year) {
  return api.get(`/stats/year?year=${year}`);
}

export function getSummary() {
  return api.get('/stats/summary');
}
