import React, { useState } from 'react';
import Navbar from '../components/Layout/Navbar.jsx';
import MonthHeatmap from '../components/Calendar/MonthHeatmap.jsx';
import YearHeatmap from '../components/Calendar/YearHeatmap.jsx';
import DayPopover from '../components/Calendar/DayPopover.jsx';
import RolloverNudge from '../components/Calendar/RolloverNudge.jsx';
import TaskList from '../components/Tasks/TaskList.jsx';
import { todayStr, formatDayLabel } from '../utils/date.js';

export default function HomePage() {
  const now = new Date();
  const [view, setView] = useState('month'); // 'month' | 'year'
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(null);

  const today = todayStr();

  return (
    <div className="min-h-screen bg-mist-100 dark:bg-night-900">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <RolloverNudge />

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-xl2 bg-white p-5 shadow-soft dark:bg-night-800 dark:border dark:border-night-700 lg:col-span-2">
            <div className="mb-4 flex items-center justify-end">
              <div className="inline-flex rounded-full bg-mist-200 p-1 text-sm dark:bg-night-700">
                <button
                  onClick={() => setView('month')}
                  className={`rounded-full px-3 py-1 ${
                    view === 'month' ? 'bg-white shadow-sm dark:bg-night-600' : ''
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setView('year')}
                  className={`rounded-full px-3 py-1 ${
                    view === 'year' ? 'bg-white shadow-sm dark:bg-night-600' : ''
                  }`}
                >
                  Year
                </button>
              </div>
            </div>

            {view === 'month' ? (
              <MonthHeatmap
                year={year}
                month={month}
                onMonthChange={(y, m) => {
                  setYear(y);
                  setMonth(m);
                }}
                onSelectDay={setSelectedDay}
              />
            ) : (
              <YearHeatmap year={year} onYearChange={setYear} onSelectDay={setSelectedDay} />
            )}
          </section>

          <section className="rounded-xl2 bg-white p-5 shadow-soft dark:bg-night-800 dark:border dark:border-night-700">
            <h2 className="mb-1 font-display text-lg font-semibold">Today</h2>
            <p className="mb-4 text-sm text-ink-700 dark:text-mist-400">{formatDayLabel(today)}</p>
            <TaskList date={today} />
          </section>
        </div>
      </main>

      <DayPopover date={selectedDay} onClose={() => setSelectedDay(null)} />
    </div>
  );
}
