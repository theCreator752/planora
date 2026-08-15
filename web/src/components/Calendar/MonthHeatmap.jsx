import React, { useMemo } from 'react';
import {
  daysInMonth,
  firstWeekdayOfMonth,
  formatMonthLabel,
  toDateStr,
  WEEKDAY_LABELS,
} from '../../utils/date.js';
import { useMonthStats } from '../../hooks/useStats.js';
import DayCell from './DayCell.jsx';
import Spinner from '../common/Spinner.jsx';

export default function MonthHeatmap({ year, month, onMonthChange, onSelectDay }) {
  const { data, isLoading } = useMonthStats(year, month);

  const percentByDate = useMemo(() => {
    const map = new Map();
    (data?.days || []).forEach((d) => map.set(d.date, d.completionPercent));
    return map;
  }, [data]);

  const total = daysInMonth(year, month);
  const offset = firstWeekdayOfMonth(year, month);
  const cells = [];
  for (let i = 0; i < offset; i += 1) cells.push(null);
  for (let day = 1; day <= total; day += 1) cells.push(day);

  function goPrev() {
    const m = month === 1 ? 12 : month - 1;
    const y = month === 1 ? year - 1 : year;
    onMonthChange(y, m);
  }
  function goNext() {
    const m = month === 12 ? 1 : month + 1;
    const y = month === 12 ? year + 1 : year;
    onMonthChange(y, m);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={goPrev}
          aria-label="Previous month"
          className="rounded-full p-2 hover:bg-mist-200 dark:hover:bg-night-700"
        >
          ←
        </button>
        <h2 className="font-display text-xl font-semibold">{formatMonthLabel(year, month)}</h2>
        <button
          onClick={goNext}
          aria-label="Next month"
          className="rounded-full p-2 hover:bg-mist-200 dark:hover:bg-night-700"
        >
          →
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="mb-1 grid grid-cols-7 gap-1.5">
            {WEEKDAY_LABELS.map((w, i) => (
              <div
                key={i}
                className="text-center text-xs font-medium text-ink-700 dark:text-mist-300"
              >
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((day, idx) =>
              day === null ? (
                <div key={`empty-${idx}`} />
              ) : (
                <DayCell
                  key={day}
                  date={toDateStr(year, month, day)}
                  day={day}
                  percent={percentByDate.get(toDateStr(year, month, day)) ?? null}
                  onSelect={onSelectDay}
                />
              )
            )}
          </div>
        </>
      )}

      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-700 dark:text-mist-300">
      <LegendSwatch className="bg-mist-200 dark:bg-night-600" label="No tasks" />
      <LegendSwatch style={{ backgroundColor: 'rgb(155,32,25)' }} label="0% !" />
      <LegendSwatch style={{ backgroundColor: 'rgb(253,226,150)' }} label="50–99% ●" />
      <LegendSwatch style={{ backgroundColor: 'rgb(42,122,78)' }} label="100% ✓" />
    </div>
  );
}

function LegendSwatch({ label, className = '', style }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-sm ${className}`} style={style} />
      {label}
    </span>
  );
}
