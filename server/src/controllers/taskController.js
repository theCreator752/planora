const { validationResult } = require('express-validator');
const Task = require('../models/Task');

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: 'Validation failed', details: errors.array() });
    return true;
  }
  return false;
}

// GET /api/tasks?date=YYYY-MM-DD
async function getTasks(req, res, next) {
  try {
    if (handleValidation(req, res)) return;

    const { date } = req.query;
    const tasks = await Task.find({ userId: req.userId, date }).sort({ createdAt: 1 });

    res.json({ date, tasks });
  } catch (err) {
    next(err);
  }
}

// POST /api/tasks
async function createTask(req, res, next) {
  try {
    if (handleValidation(req, res)) return;

    const { title, description, date, priority } = req.body;

    const task = await Task.create({
      userId: req.userId,
      title,
      description: description || '',
      date,
      priority: priority || 'med',
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

// PUT /api/tasks/:id  — partial update, also used to toggle isCompleted
async function updateTask(req, res, next) {
  try {
    if (handleValidation(req, res)) return;

    const { id } = req.params;
    const allowedFields = ['title', 'description', 'date', 'priority', 'isCompleted'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/tasks/:id
async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
