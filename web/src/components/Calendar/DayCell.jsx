import React from 'react';
import { heatmapColor, heatmapGlyph, heatmapTextClass } from '../../utils/heatmapColor.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import { todayStr } from '../../utils/date.js';

export default function DayCell({ date, day, percent, onSelect }) {
  const { theme } = useTheme();
  const isToday = date === todayStr();
  const { glyph, label } = heatmapGlyph(percent);
  const bg = heatmapColor(percent, theme);
  const textClass = heatmapTextClass(percent);

  return (
    <button
      onClick={() => onSelect(date)}
      aria-label={`${date}: ${label}`}
      style={{ backgroundColor: bg }}
      className={`group relative flex aspect-square w-full flex-col items-center justify-center rounded-lg
        transition-transform hover:scale-[1.04] hover:shadow-soft focus-visible:scale-[1.04]
        ${isToday ? 'ring-2 ring-dusk-500 ring-offset-2 ring-offset-mist-100 dark:ring-offset-night-900' : ''}`}
    >
      <span className={`text-xs font-medium tabular ${textClass}`}>{day}</span>
      {glyph && <span className={`text-[10px] leading-none ${textClass}`}>{glyph}</span>}
    </button>
  );
}
