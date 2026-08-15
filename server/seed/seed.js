require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

const DEMO_EMAIL = 'demo@taskmanager.dev';
const DEMO_PASSWORD = 'password123';

const PRIORITIES = ['low', 'med', 'high'];
const TITLES = [
  'Reply to emails',
  'Morning workout',
  'Write project report',
  'Review pull requests',
  'Grocery shopping',
  'Plan tomorrow',
  'Read for 20 minutes',
  'Call the dentist',
  'Team standup',
  'Water the plants',
  'Pay bills',
  'Clean the kitchen',
];

function pad(n) {
  return String(n).padStart(2, '0');
}

function dateStr(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function pickTitle(i) {
  return TITLES[i % TITLES.length];
}

async function seed() {
  await connectDB();

  let user = await User.findOne({ email: DEMO_EMAIL });
  if (!user) {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
    user = await User.create({ name: 'Demo User', email: DEMO_EMAIL, passwordHash });
    console.log(`Created demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  } else {
    console.log(`Using existing demo user: ${DEMO_EMAIL}`);
  }

  await Task.deleteMany({ userId: user._id });
  console.log('Cleared existing demo tasks');

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const totalDays = daysInMonth(year, month);
  const today = now.getDate();

  // Deterministic pseudo-random pattern so the heatmap shows a mix of
  // no-task, red, yellow, and green days across the current month
  // (only for days up to and including today — future days get 0-2 tasks
  // planned but left incomplete, since they haven't happened yet).
  const docs = [];
  let titleCursor = 0;

  for (let day = 1; day <= totalDays; day += 1) {
    const date = dateStr(year, month, day);
    const isFuture = day > today;

    // ~20% of past days intentionally have no tasks at all (neutral grey).
    if (!isFuture && day % 5 === 0) continue;

    const taskCount = isFuture ? (day % 3 === 0 ? 2 : 0) : 2 + (day % 4); // 2-5 tasks
    if (taskCount === 0) continue;

    // Vary completion rate by day so the heatmap spans the full spectrum.
    let completionRate;
    if (isFuture) {
      completionRate = 0; // nothing completed yet for future-planned tasks
    } else if (day % 7 === 0) {
      completionRate = 1; // perfect day
    } else if (day % 3 === 0) {
      completionRate = 0.75;
    } else if (day % 2 === 0) {
      completionRate = 0.4;
    } else {
      completionRate = 0.15;
    }

    const completedCount = Math.round(taskCount * completionRate);

    for (let t = 0; t < taskCount; t += 1) {
      docs.push({
        userId: user._id,
        title: pickTitle(titleCursor++),
        description: '',
        date,
        priority: PRIORITIES[t % PRIORITIES.length],
        isCompleted: t < completedCount,
      });
    }
  }

  await Task.insertMany(docs);
  console.log(`Inserted ${docs.length} demo tasks across ${year}-${pad(month)}`);

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
