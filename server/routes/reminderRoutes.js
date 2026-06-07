const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const { sendWhatsApp, sendSMS } = require('../utils/sendWhatsApp');

// @route  GET /api/reminders/pending
// @desc   List appointments with unsent reminders (for dashboard info)
// @access Private
router.get('/pending', protect, asyncHandler(async (req, res) => {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60*60*1000).toISOString().split('T')[0];

  const pending = await Appointment.find({
    clinicId: req.user.clinicId,
    date: in24h,
    status: { $in: ['scheduled', 'confirmed'] },
    'reminderSent.hours24': false,
  }).populate('patientId', 'name phone');

  res.json({ success: true, count: pending.length, appointments: pending });
}));

// @route  POST /api/reminders/send/:id
// @desc   Manually send reminder for a specific appointment
// @access Private
router.post('/send/:id', protect, asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    clinicId: req.user.clinicId,
  }).populate('patientId', 'name phone');

  if (!appointment) { res.status(404); throw new Error('Appointment not found'); }

  const patient = appointment.patientId;
  const msg = `🔔 *Appointment Reminder*\nHello ${patient.name},\nYour appointment is on *${appointment.date}* at *${appointment.timeSlot}*.\nReply *CONFIRM* to confirm or *CANCEL* to cancel.`;

  try {
    await sendWhatsApp(patient.phone, msg);
    res.json({ success: true, message: `Reminder sent to ${patient.phone}` });
  } catch (err) {
    try {
      await sendSMS(patient.phone, msg);
      res.json({ success: true, message: `SMS reminder sent to ${patient.phone} (WhatsApp failed)` });
    } catch (smsErr) {
      res.status(500);
      throw new Error('Failed to send reminder via WhatsApp and SMS');
    }
  }
}));

// @route  POST /api/reminders/test-whatsapp
// @desc   Send a test WhatsApp message to a given number (Admin only)
// @access Private / Admin
router.post('/test-whatsapp', protect, adminOnly, asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) { res.status(400); throw new Error('Phone number is required'); }

  const { isWhatsAppEnabled } = require('../utils/sendWhatsApp');
  if (!isWhatsAppEnabled()) {
    res.status(400);
    throw new Error('WhatsApp is not configured. Check META_WA_TOKEN and META_WA_PHONE_ID in .env');
  }

  await sendWhatsApp(
    phone,
    `🎉 *ClinicPulse Test Message*\n\nHello! This is a test message from your ClinicPulse clinic management system.\n\nWhatsApp integration is working correctly! ✅\n\n_Sent at ${new Date().toLocaleString('en-PK')}_`
  );

  res.json({ success: true, message: `Test WhatsApp sent to ${phone} ✅` });
}));

module.exports = router;
