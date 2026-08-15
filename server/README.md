# Task Manager — Backend API

Express + MongoDB (Mongoose) REST API for the task manager app: auth, task CRUD,
and the stats/heatmap endpoint. Built as the first phase of a MERN task manager
(web and mobile clients come later and will consume this same API).

## Stack

- Node.js + Express
- MongoDB via Mongoose
- JWT auth (short-lived access token + rotating refresh token), bcrypt password hashing
- express-validator for request validation

## Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:

```
MONGO_URI=<your MongoDB Atlas or local connection string>
JWT_ACCESS_SECRET=<long random string>
JWT_REFRESH_SECRET=<a different long random string>
```

Generate strong secrets quickly with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Run the server:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

You should see:

```
MongoDB connected: <host>/<db>
Task Manager API listening on http://localhost:5000
```

Check it's alive:

```bash
curl http://localhost:5000/api/health
```

### Seed demo data

```bash
npm run seed
```

Creates (or reuses) a demo user and fills the **current month** with a mix
of no-task days, low/mid/high completion days, and a few 100% days, so the
calendar heatmap has something interesting to render right away.

```
email:    demo@taskmanager.dev
password: password123
```

## API Reference

All request/response bodies are JSON. Protected routes require:
`Authorization: Bearer <accessToken>`.

### Auth — `/api/auth`

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/signup` | `{ name, email, password }` | Returns `{ user, accessToken, refreshToken }` |
| POST | `/login` | `{ email, password }` | Same response shape as signup |
| POST | `/refresh` | `{ refreshToken }` | Rotates the refresh token; returns a new pair |
| POST | `/logout` | `{ refreshToken }` | Invalidates that refresh token server-side |
| POST | `/forgot-password` | `{ email }` | Stubbed: logs a reset token to the server console instead of emailing it. In non-production, the response also includes `devResetToken` for easy testing. |
| POST | `/reset-password` | `{ token, newPassword }` | Consumes the token, sets the new password, invalidates all sessions |

**Password minimum length:** 8 characters.

### Tasks — `/api/tasks` (auth required)

| Method | Path | Query/Body | Notes |
|---|---|---|---|
| GET | `/?date=YYYY-MM-DD` | — | All of the caller's tasks for that date |
| POST | `/` | `{ title, description?, date, priority? }` | `priority` defaults to `med` |
| PUT | `/:id` | any subset of `{ title, description, date, priority, isCompleted }` | Used both for edits and toggling completion |
| DELETE | `/:id` | — | Hard-deletes the task. (The app's UX principle of "don't silently delete, mark as missed" is a *display* concept computed from `date < today && !isCompleted` — there's no separate `missed` field to keep the model simple. Deleting is still a real, explicit user action.) |

### Stats — `/api/stats` (auth required)

| Method | Path | Notes |
|---|---|---|
| GET | `/month?year=YYYY&month=MM` | Per-day `{ date, totalTasks, completedTasks, completionPercent }` for the month — this is the endpoint listed in the spec, feeds the month heatmap |
| GET | `/year?year=YYYY` | Same shape, for the whole year — feeds the GitHub-style year view *(bonus, not in the original spec)* |
| GET | `/summary` | `{ currentStreak, bestStreak, totalTasksCompleted, totalTasksScheduled, weeklyCompletionRate, monthlyCompletionRate }` — feeds the stats dashboard and streak counter *(bonus, not in the original spec)* |

`completionPercent` is `null` for days with no tasks — treat that as neutral
grey on the frontend, not a failure. Days that never come back in the array
at all (e.g. months with sparse data) mean the same thing.

**Streak rule:** a day with zero tasks is skipped over (doesn't break or
extend a streak); a day below 100% completion ends the streak.

## Data Models

**User**
```
name, email (unique), passwordHash, refreshTokens[] (hashed),
resetPasswordTokenHash, resetPasswordExpires, createdAt
```

**Task**
```
userId (ref User), title, description, date ("YYYY-MM-DD" string),
priority ("low"|"med"|"high"), isCompleted, createdAt
```

## Design notes / things you should know before building the frontend

- **Refresh tokens are rotated and stored hashed** on the user document
  (last 10 kept). Each `/refresh` call invalidates the token used and issues
  a new pair — treat refresh tokens as single-use.
- **`date` is stored as a plain `YYYY-MM-DD` string**, not a `Date`, so the
  heatmap's per-day grouping and querying stays simple and timezone-free.
  The client owns "what day is this task for" — send the string the user
  picked, don't convert to UTC and back.
- **CORS** is locked to `CLIENT_URL` in `.env` (comma-separate multiple
  origins for web + any local mobile dev URL). It defaults to allow-all if
  unset, which is fine for local dev but should be tightened for deployment.
- **Password reset has no real email provider wired up** — it logs the raw
  token server-side (and echoes it in the response outside production) so
  the flow is fully testable now; swap in SES/SendGrid/etc. later without
  changing the endpoint contract.
- Not yet built: the `web/` and `mobile/` clients, and push notifications.
  Those consume this API as-is once you're ready for them.

## Project structure

```
server/
  src/
    config/db.js
    models/{User,Task}.js
    middleware/auth.js
    controllers/{auth,task,stats}Controller.js
    routes/{auth,task,stats}Routes.js
    utils/jwt.js
    app.js         # express app + middleware + routes + error handler
    server.js      # entry point: connect DB, then listen
  seed/seed.js
  .env.example
```
