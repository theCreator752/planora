const express = require('express');
const { body, query, param } = require('express-validator');
const taskController = require('../controllers/taskController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

router.use(requireAuth);

router.get(
  '/',
  [query('date').matches(DATE_RE).withMessage('date must be YYYY-MM-DD')],
  taskController.getTasks
);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('date').matches(DATE_RE).withMessage('date must be YYYY-MM-DD'),
    body('priority').optional().isIn(['low', 'med', 'high']),
  ],
  taskController.createTask
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task id'),
    body('title').optional().trim().notEmpty(),
    body('description').optional().isString(),
    body('date').optional().matches(DATE_RE).withMessage('date must be YYYY-MM-DD'),
    body('priority').optional().isIn(['low', 'med', 'high']),
    body('isCompleted').optional().isBoolean(),
  ],
  taskController.updateTask
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task id')],
  taskController.deleteTask
);

module.exports = router;
