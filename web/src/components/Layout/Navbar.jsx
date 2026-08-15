import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useSummary } from '../../hooks/useStats.js';
import Button from '../common/Button.jsx';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-dusk-500 text-white'
      : 'text-ink-700 hover:bg-mist-200 dark:text-mist-300 dark:hover:bg-night-700'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data: summary } = useSummary();

  return (
    <header className="sticky top-0 z-30 border-b border-mist-200 bg-mist-100/90 backdrop-blur dark:border-night-700 dark:bg-night-900/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="font-display text-lg font-semibold">Almanac</span>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Calendar
            </NavLink>
            <NavLink to="/stats" className={navLinkClass}>
              Stats
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {summary && (
            <div
              className="flex items-center gap-1 rounded-full bg-flame-500/10 px-3 py-1 text-sm font-semibold text-flame-600 dark:text-flame-400"
              title={`Best streak: ${summary.bestStreak} days`}
            >
              <span aria-hidden="true">🔥</span>
              <span className="tabular">{summary.currentStreak}</span>
            </div>
          )}

          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-full p-2 text-ink-700 hover:bg-mist-200 dark:text-mist-300 dark:hover:bg-night-700"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <span className="hidden text-sm text-ink-700 dark:text-mist-300 sm:inline">
            {user?.name}
          </span>

          <Button variant="secondary" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
