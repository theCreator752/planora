const mongoose = require('mongoose');
const Task = require('../models/Task');

function pct(completed, total) {
  return total === 0 ? null : Math.round((completed / total) * 10000) / 100; // 2 dp
}

/**
 * Aggregates all of a user's tasks grouped by date into
 * { date, totalTasks, completedTasks, completionPercent } rows.
 * completionPercent is null when totalTasks === 0 (front end should
 * treat null as "no tasks scheduled" -> neutral grey, not a failure).
 */
async function aggregateByDate(userId, dateRegex) {
  const rows = await Task.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        ...(dateRegex ? { date: { $regex: dateRegex } } : {}),
      },
    },
    {
      $group: {
        _id: '$date',
        totalTasks: { $sum: 1 },
        completedTasks: { $sum: { $cond: ['$isCompleted', 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return rows.map((r) => ({
    date: r._id,
    totalTasks: r.totalTasks,
    completedTasks: r.completedTasks,
    completionPercent: pct(r.completedTasks, r.totalTasks),
  }));
}

// GET /api/stats/month?year=YYYY&month=MM
async function getMonthStats(req, res, next) {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ error: 'year and month query params are required' });
    }
    const mm = String(month).padStart(2, '0');
    if (!/^\d{4}$/.test(year) || !/^(0[1-9]|1[0-2])$/.test(mm)) {
      return res.status(400).json({ error: 'year must be YYYY and month must be 01-12' });
    }

    const days = await aggregateByDate(req.userId, `^${year}-${mm}-`);

    res.json({ year: Number(year), month: Number(mm), days });
  } catch (err) {
    next(err);
  }
}

// GET /api/stats/year?year=YYYY  — full 365/366-day grid for the year view
async function getYearStats(req, res, next) {
  try {
    const { year } = req.query;
    if (!year || !/^\d{4}$/.test(year)) {
      return res.status(400).json({ error: 'year query param (YYYY) is required' });
    }

    const days = await aggregateByDate(req.userId, `^${year}-`);

    res.json({ year: Number(year), days });
  } catch (err) {
    next(err);
  }
}

function toDateObj(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Streak rules: days with no tasks are neutral and don't break a streak,
 * but they don't extend it either — they're simply skipped over. A day
 * below 100% completion ends the streak.
 */
function computeStreaks(days) {
  // days: sorted ascending [{date, totalTasks, completedTasks, completionPercent}]
  const scheduled = days.filter((d) => d.totalTasks > 0);
  if (scheduled.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Best streak: longest run of consecutive (by calendar day, ignoring
  // no-task gaps) 100% days anywhere in history.
  let best = 0;
  let run = 0;
  for (const day of scheduled) {
    if (day.completionPercent === 100) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  }

  // Current streak: walk backwards from the most recent scheduled day
  // that is not in the future, stopping at the first non-100% day.
  const today = todayStr();
  const upToToday = scheduled.filter((d) => d.date <= today);
  let current = 0;
  for (let i = upToToday.length - 1; i >= 0; i -= 1) {
    if (upToToday[i].completionPercent === 100) {
      current += 1;
    } else {
      break;
    }
  }

  return { currentStreak: current, bestStreak: best };
}

function rateForRange(days, fromStr, toStr) {
  const inRange = days.filter((d) => d.date >= fromStr && d.date <= toStr && d.totalTasks > 0);
  const total = inRange.reduce((sum, d) => sum + d.totalTasks, 0);
  const completed = inRange.reduce((sum, d) => sum + d.completedTasks, 0);
  return pct(completed, total);
}

// GET /api/stats/summary — dashboard numbers: streaks, completion rates, totals
async function getSummary(req, res, next) {
  try {
    const days = await aggregateByDate(req.userId, null);

    const today = todayStr();
    const weekAgo = new Date();
    weekAgo.setUTCDate(weekAgo.getUTCDate() - 6);
    const weekAgoStr = weekAgo.toISOString().slice(0, 10);
    const monthStart = `${today.slice(0, 7)}-01`;

    const { currentStreak, bestStreak } = computeStreaks(days);
    const totalCompleted = days.reduce((sum, d) => sum + d.completedTasks, 0);
    const totalTasks = days.reduce((sum, d) => sum + d.totalTasks, 0);

    res.json({
      currentStreak,
      bestStreak,
      totalTasksCompleted: totalCompleted,
      totalTasksScheduled: totalTasks,
      weeklyCompletionRate: rateForRange(days, weekAgoStr, today),
      monthlyCompletionRate: rateForRange(days, monthStart, today),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMonthStats, getYearStats, getSummary };
