const express = require('express');
const router = express.Router();
const { getBilling, addBill, markPaid, getSummary } = require('../controllers/billingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',            protect, getBilling);
router.post('/add',        protect, addBill);
router.get('/summary',     protect, adminOnly, getSummary);
router.put('/:id/pay',     protect, markPaid);

module.exports = router;
