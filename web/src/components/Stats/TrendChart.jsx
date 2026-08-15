import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useYearStats } from '../../hooks/useStats.js';
import { todayStr } from '../../utils/date.js';
import Spinner from '../common/Spinner.jsx';

export default function TrendChart() {
  const year = new Date().getFullYear();
  const { data, isLoading } = useYearStats(year);
  const today = todayStr();

  const chartData = useMemo(() => {
    const days = (data?.days || []).filter((d) => d.date <= today && d.completionPercent !== null);
    return days.slice(-30).map((d) => ({
      date: d.date.slice(5), // MM-DD
      percent: d.completionPercent,
    }));
  }, [data, today]);

  if (isLoading) {
    return (
      <div className="flex h-56 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-ink-700 dark:text-mist-400">
        Complete a few tasks to see your trend line here.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-mist-200 dark:stroke-night-700" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          interval="preserveStartEnd"
          minTickGap={20}
        />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} width={36} />
        <Tooltip
          formatter={(value) => [`${value}%`, 'Completion']}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Line
          type="monotone"
          dataKey="percent"
          stroke="#3B4B7A"
          strokeWidth={2}
          dot={{ r: 2 }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
