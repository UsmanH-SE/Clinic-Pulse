const express = require('express');
const router = express.Router();
const { getOverview, getTrends, getBusySlots, getNoShowTrend } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/overview',       protect, adminOnly, getOverview);
router.get('/trends',         protect, adminOnly, getTrends);
router.get('/busy-slots',     protect, adminOnly, getBusySlots);
router.get('/no-show-trend',  protect, adminOnly, getNoShowTrend);

module.exports = router;
