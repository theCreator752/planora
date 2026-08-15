# Task Manager — Web App

React (Vite) + Tailwind CSS frontend. Consumes the `server/` REST API for
auth, task CRUD, and the stats/heatmap data.

## Setup

```bash
cd web
npm install
cp .env.example .env
```

By default `.env` points at `http://localhost:5000/api` — update
`VITE_API_URL` if your backend runs elsewhere.

```bash
npm run dev
```

Open http://localhost:5173. Make sure the backend (`server/`) is running
first — signup/login will fail with a network error otherwise.

If you ran `npm run seed` in `server/`, you can log in directly with:

```
email:    demo@taskmanager.dev
password: password123
```

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## What's here

- **Calendar heatmap is the home screen** (`/`) — month view by default,
  toggle to a GitHub-style year view. Click any day to open its task list
  in a popover.
- **Color interpolation** lives in `src/utils/heatmapColor.js` — smooth
  red → yellow → green gradient, computed from raw completion percentages
  from the API, not three flat buckets. Every cell also carries a glyph
  (`!`, `●`, `✓`) and an `aria-label` so the heatmap isn't color-only.
- **Quick add**: a single text input on the Today panel and inside each
  day's popover — type a title, hit Enter, done. Full editing (description,
  date, priority) is one click away via the task's row.
- **Streaks & stats** (`/stats`): current/best streak, weekly/monthly
  completion rate, a 30-day trend line, and three achievement badges
  (7-day streak, 100 tasks completed, perfect week) that light up once
  earned.
- **Rollover nudge**: if yesterday had incomplete tasks, a banner on the
  home screen offers to copy them into today with one click.
- **Completion confetti**: fires when the last task in a day's list gets
  checked off (skipped automatically if the browser has
  `prefers-reduced-motion` set).
- **Dark mode**: toggle in the navbar, persisted, defaults to the OS
  preference on first visit.
- **Auth**: signup/login/logout wired to the API's JWT pair; access tokens
  refresh silently in the background (see `src/api/client.js`) and the app
  drops back to `/login` if the refresh token is also invalid.

## Design notes

- Palette and type system are defined as Tailwind tokens in
  `tailwind.config.js` (see the `mist`/`ink`/`dusk`/`night`/`flame` color
  scales) — deliberately not the cream+terracotta or near-black+neon-green
  looks that most AI-generated UIs default to. The heatmap's own red/
  yellow/green scale is semantic (it encodes completion %) and is kept
  visually separate from the brand accent color used for buttons/links.
- Fraunces (display) + Inter (body) + IBM Plex Mono (numbers/dates) — the
  mono face is used anywhere a number needs to read like a ledger entry
  (streak count, stat tiles, calendar day numbers).
- Focus states are visible everywhere (`:focus-visible` in `index.css`),
  and all animation respects `prefers-reduced-motion`.

## Known gaps / next steps

- **Push notifications are not implemented yet.** The spec calls for
  evening/morning reminders via web push, but that needs VAPID keys, a
  service worker, and a `POST /api/push/subscribe`-style endpoint that
  isn't part of the current backend. Worth a follow-up pass once you're
  ready for it — happy to build it next.
- No offline/PWA support yet.
- The production bundle is a single ~640 KB JS chunk (recharts + the app).
  Fine for now; if it starts to matter, `recharts` is the easiest thing to
  lazy-load since it's only used on `/stats`.

## Project structure

```
web/
  src/
    api/            fetch client (auto token refresh) + per-resource calls
    context/         AuthContext, ThemeContext
    hooks/           React Query hooks (useTasks, useStats)
    utils/           date helpers, heatmap color interpolation, confetti
    components/
      Auth/          login/signup/forgot/reset forms + shared layout
      Calendar/      DayCell, MonthHeatmap, YearHeatmap, DayPopover, RolloverNudge
      Tasks/         TaskList, TaskItem, QuickAddTask, TaskModal, PriorityBadge
      Stats/         StatTile, TrendChart, Badges
      Layout/        Navbar
      common/        Button, Modal, Spinner
    pages/           HomePage, StatsPage, Login/Signup/ForgotPassword/ResetPassword
    routes/          ProtectedRoute
    App.jsx
    main.jsx
```
