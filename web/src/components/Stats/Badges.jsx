import React from 'react';

const BADGES = [
  {
    id: 'streak-7',
    label: '7-day streak',
    icon: '🔥',
    isUnlocked: (s) => s.bestStreak >= 7,
  },
  {
    id: 'tasks-100',
    label: '100 tasks completed',
    icon: '💯',
    isUnlocked: (s) => s.totalTasksCompleted >= 100,
  },
  {
    id: 'perfect-week',
    label: 'Perfect week',
    icon: '🏆',
    isUnlocked: (s) => s.weeklyCompletionRate === 100,
  },
];

export default function Badges({ summary }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {BADGES.map((badge) => {
        const unlocked = summary ? badge.isUnlocked(summary) : false;
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-1.5 rounded-xl2 border p-3 text-center transition-opacity ${
              unlocked
                ? 'border-flame-500/40 bg-flame-500/10'
                : 'border-mist-200 opacity-40 dark:border-night-700'
            }`}
            aria-label={`${badge.label}: ${unlocked ? 'unlocked' : 'locked'}`}
          >
            <span className="text-2xl" aria-hidden="true">
              {badge.icon}
            </span>
            <span className="text-xs font-medium leading-tight">{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
}
