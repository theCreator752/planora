import React, { useMemo } from 'react';
import { useYearStats } from '../../hooks/useStats.js';
import { heatmapColor, heatmapGlyph } from '../../utils/heatmapColor.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import { todayStr, MONTH_NAMES } from '../../utils/date.js';
import Spinner from '../common/Spinner.jsx';

function pad(n) {
  return String(n).padStart(2, '0');
}

/** Builds one column per week, 7 rows (Sun-Sat), like GitHub's contribution graph. */
function buildWeeks(year) {
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year, 11, 31));

  // Back up to the Sunday on/before Jan 1 so the grid's first row aligns.
  const gridStart = new Date(start);
  gridStart.setUTCDate(gridStart.getUTCDate() - gridStart.getUTCDay());

  const weeks = [];
  let cursor = new Date(gridStart);
  while (cursor <= end) {
    const week = [];
    for (let d = 0; d < 7; d += 1) {
      const inYear = cursor.getUTCFullYear() === year;
      week.push({
        date: inYear
          ? `${cursor.getUTCFullYear()}-${pad(cursor.getUTCMonth() + 1)}-${pad(cursor.getUTCDate())}`
          : null,
        month: cursor.getUTCMonth(),
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export default function YearHeatmap({ year, onYearChange, onSelectDay }) {
  const { data, isLoading } = useYearStats(year);
  const { theme } = useTheme();
  const today = todayStr();

  const percentByDate = useMemo(() => {
    const map = new Map();
    (data?.days || []).forEach((d) => map.set(d.date, d.completionPercent));
    return map;
  }, [data]);

  const weeks = useMemo(() => buildWeeks(year), [year]);

  // Month labels: mark the first week column where a new month begins.
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = null;
    weeks.forEach((week, wi) => {
      const firstRealDay = week.find((d) => d.date);
      if (firstRealDay && firstRealDay.month !== lastMonth) {
        labels.push({ weekIndex: wi, label: MONTH_NAMES[firstRealDay.month].slice(0, 3) });
        lastMonth = firstRealDay.month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => onYearChange(year - 1)}
          aria-label="Previous year"
          className="rounded-full p-2 hover:bg-mist-200 dark:hover:bg-night-700"
        >
          ←
        </button>
        <h2 className="font-display text-xl font-semibold">{year}</h2>
        <button
          onClick={() => onYearChange(year + 1)}
          aria-label="Next year"
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
        <div className="overflow-x-auto pb-2">
          <div className="relative mb-1 h-4" style={{ width: weeks.length * 14 }}>
            {monthLabels.map(({ weekIndex, label }) => (
              <span
                key={weekIndex}
                className="absolute text-[10px] text-ink-700 dark:text-mist-300"
                style={{ left: weekIndex * 14 }}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell, di) => {
                  if (!cell.date) return <div key={di} className="h-3 w-3" />;
                  const percent = percentByDate.get(cell.date) ?? null;
                  const { label } = heatmapGlyph(percent);
                  const isFuture = cell.date > today;
                  return (
                    <button
                      key={di}
                      onClick={() => onSelectDay(cell.date)}
                      aria-label={`${cell.date}: ${label}`}
                      title={cell.date}
                      style={{
                        backgroundColor: heatmapColor(percent, theme),
                        opacity: isFuture && percent === null ? 0.5 : 1,
                      }}
                      className="h-3 w-3 rounded-[2px] transition-transform hover:scale-125 focus-visible:scale-125"
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
