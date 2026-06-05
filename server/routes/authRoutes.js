const express = require('express');
const router = express.Router();
const { register, login, getMe, addStaff, getStaff, toggleStaff } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public
router.post('/register', register);
router.post('/login', login);

// Protected (any logged-in staff)
router.get('/me', protect, getMe);

// Admin only
router.post('/add-staff',          protect, adminOnly, addStaff);
router.get('/staff',               protect, adminOnly, getStaff);
router.put('/staff/:id/toggle',    protect, adminOnly, toggleStaff);

module.exports = router;
