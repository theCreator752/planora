const express = require('express');
const statsController = require('../controllers/statsController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

// GET /api/stats/month?year=YYYY&month=MM  (required by spec)
router.get('/month', statsController.getMonthStats);

// GET /api/stats/year?year=YYYY  (bonus: powers the year-view heatmap)
router.get('/year', statsController.getYearStats);

// GET /api/stats/summary  (bonus: powers the stats dashboard + streak counter)
router.get('/summary', statsController.getSummary);

module.exports = router;
