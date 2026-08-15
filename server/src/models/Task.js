const mongoose = require('mongoose');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    date: {
      type: String, // stored as YYYY-MM-DD so day-based queries/grouping stay simple
      required: [true, 'Date is required'],
      validate: {
        validator: (v) => DATE_RE.test(v),
        message: 'date must be in YYYY-MM-DD format',
      },
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'med', 'high'],
      default: 'med',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

// Common access pattern: "give me this user's tasks for date X"
TaskSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Task', TaskSchema);
