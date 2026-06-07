const express = require('express');
const router = express.Router();
const {
  getAppointments, getTodayAppointments, getSlots, bookAppointment,
  updateStatus, deleteAppointment, handleWhatsAppReply
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Public — Twilio webhook (no auth)
router.post('/webhook/reply', handleWhatsAppReply);

// Protected
router.get('/',              protect, getAppointments);
router.get('/today',         protect, getTodayAppointments);
router.get('/slots',         protect, getSlots);
router.post('/book',         protect, bookAppointment);
router.put('/:id/status',    protect, updateStatus);
router.delete('/:id',        protect, deleteAppointment);

module.exports = router;
