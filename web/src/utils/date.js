function pad(n) {
  return String(n).padStart(2, '0');
}

export function toDateStr(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function todayStr() {
  const d = new Date();
  return toDateStr(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

export function tomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toDateStr(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

export function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateStr(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

export function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function firstWeekdayOfMonth(year, month) {
  // 0 = Sunday
  return new Date(year, month - 1, 1).getDay();
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function formatMonthLabel(year, month) {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function formatDayLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

export function isFutureDate(dateStr) {
  return dateStr > todayStr();
}

export function isPastDate(dateStr) {
  return dateStr < todayStr();
}
