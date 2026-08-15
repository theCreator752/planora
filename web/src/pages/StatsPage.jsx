import React from 'react';
import Navbar from '../components/Layout/Navbar.jsx';
import { useSummary } from '../hooks/useStats.js';
import StatTile from '../components/Stats/StatTile.jsx';
import TrendChart from '../components/Stats/TrendChart.jsx';
import Badges from '../components/Stats/Badges.jsx';
import Spinner from '../components/common/Spinner.jsx';

export default function StatsPage() {
  const { data: summary, isLoading } = useSummary();

  return (
    <div className="min-h-screen bg-mist-100 dark:bg-night-900">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="mb-6 font-display text-2xl font-semibold">Stats</h1>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label="Current streak" value={summary?.currentStreak ?? 0} icon="🔥" />
              <StatTile label="Best streak" value={summary?.bestStreak ?? 0} icon="🏅" />
              <StatTile
                label="This week"
                value={summary?.weeklyCompletionRate ?? 0}
                suffix="%"
                icon="📅"
              />
              <StatTile
                label="This month"
                value={summary?.monthlyCompletionRate ?? 0}
                suffix="%"
                icon="🗓️"
              />
            </div>

            <section className="rounded-xl2 bg-white p-5 shadow-soft dark:bg-night-800 dark:border dark:border-night-700">
              <h2 className="mb-3 font-display text-lg font-semibold">Last 30 days</h2>
              <TrendChart />
            </section>

            <section className="rounded-xl2 bg-white p-5 shadow-soft dark:bg-night-800 dark:border dark:border-night-700">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="font-display text-lg font-semibold">Achievements</h2>
                <span className="text-sm text-ink-700 dark:text-mist-400">
                  {summary?.totalTasksCompleted ?? 0} tasks completed all-time
                </span>
              </div>
              <Badges summary={summary} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
