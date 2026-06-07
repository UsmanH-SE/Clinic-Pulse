const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Clinic = require('../models/Clinic');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { sendWhatsApp } = require('../utils/sendWhatsApp');

// @route  GET /api/appointments
// @desc   Get all appointments for a clinic (filter by date/status)
// @access Private
const getAppointments = asyncHandler(async (req, res) => {
  const { date, status, page = 1, limit = 20 } = req.query;
  const filter = { clinicId: req.user.clinicId };
  if (date)   filter.date = date;
  if (status) filter.status = status;

  const total = await Appointment.countDocuments(filter);
  const appointments = await Appointment.find(filter)
    .populate('patientId', 'name phone age gender')
    .sort({ date: 1, timeSlot: 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, total, page: Number(page), appointments });
});

// @route  GET /api/appointments/today
// @desc   Get today's appointments
// @access Private
const getTodayAppointments = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const appointments = await Appointment.find({
    clinicId: req.user.clinicId,
    date: today,
  })
    .populate('patientId', 'name phone age gender')
    .sort({ timeSlot: 1 });

  res.json({ success: true, date: today, count: appointments.length, appointments });
});

// @route  GET /api/appointments/slots?date=YYYY-MM-DD
// @desc   Get available time slots for a date
// @access Private
const getSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!date) { res.status(400); throw new Error('Date is required'); }

  // All possible clinic slots (9am – 8pm, every 30 minutes)
  const allSlots = [
    '09:00 AM', '09:30 AM',
    '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM',
    '08:00 PM',
  ];

  // Find already-booked slots for this clinic on this date
  const booked = await Appointment.find({
    clinicId: req.user.clinicId,
    date,
    status: { $in: ['scheduled', 'confirmed'] },
  }).select('timeSlot');

  const bookedSlots = booked.map(a => a.timeSlot);
  const availableSlots = allSlots.filter(s => !bookedSlots.includes(s));

  res.json({ success: true, date, availableSlots, bookedSlots });
});

// @route  POST /api/appointments/book
// @desc   Book a new appointment
// @access Private (staff) or patient (public)
const bookAppointment = asyncHandler(async (req, res) => {
  const { patientId, date, timeSlot, notes, clinicId, createdBy } = req.body;

  // Staff booking: use their clinic; public booking: clinicId must be provided
  const resolvedClinicId = req.user?.clinicId || clinicId;
  if (!resolvedClinicId) { res.status(400); throw new Error('Clinic ID is required'); }
  if (!patientId || !date || !timeSlot) {
    res.status(400);
    throw new Error('Patient, date and time slot are required');
  }

  // Check slot is not already taken
  const existing = await Appointment.findOne({
    clinicId: resolvedClinicId,
    date,
    timeSlot,
    status: { $in: ['scheduled', 'confirmed'] },
  });
  if (existing) { res.status(400); throw new Error('This time slot is already booked'); }

  // Verify patient belongs to this clinic
  const patient = await Patient.findOne({ _id: patientId, clinicId: resolvedClinicId });
  if (!patient) { res.status(404); throw new Error('Patient not found'); }

  const appointment = await Appointment.create({
    clinicId: resolvedClinicId,
    patientId,
    date,
    timeSlot,
    notes: notes || '',
    createdBy: createdBy || (req.user?.role || 'patient'),
  });

  // Send WhatsApp confirmation
  try {
    await sendWhatsApp(
      patient.phone,
      `✅ *Appointment Confirmed!*\nHello ${patient.name},\nYour appointment is booked for *${date}* at *${timeSlot}*.\nYou will receive a reminder 24 hours before.\n\nReply *CANCEL* to cancel your appointment.`
    );
  } catch (err) {
    console.error('[WhatsApp] Confirmation failed:', err.message);
  }

  await appointment.populate('patientId', 'name phone age gender');
  res.status(201).json({ success: true, appointment });
});

// @route  PUT /api/appointments/:id/status
// @desc   Update appointment status (confirm/cancel/complete/no-show)
// @access Private
const updateStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const validStatuses = ['scheduled', 'confirmed', 'cancelled', 'completed', 'no-show'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const appointment = await Appointment.findOne({
    _id: req.params.id,
    clinicId: req.user.clinicId,
  }).populate('patientId', 'name phone');

  if (!appointment) { res.status(404); throw new Error('Appointment not found'); }

  appointment.status = status;
  if (notes) appointment.notes = notes;
  await appointment.save();

  // If cancelled, notify patient on WhatsApp
  if (status === 'cancelled' && appointment.patientId?.phone) {
    try {
      await sendWhatsApp(
        appointment.patientId.phone,
        `❌ *Appointment Cancelled*\nHello ${appointment.patientId.name},\nYour appointment on *${appointment.date}* at *${appointment.timeSlot}* has been cancelled.\nPlease contact us to reschedule.`
      );
    } catch (err) {
      console.error('[WhatsApp] Cancel notification failed:', err.message);
    }
  }

  res.json({ success: true, appointment });
});

// @route  DELETE /api/appointments/:id
// @desc   Delete / cancel an appointment
// @access Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    clinicId: req.user.clinicId,
  });
  if (!appointment) { res.status(404); throw new Error('Appointment not found'); }

  appointment.status = 'cancelled';
  await appointment.save();

  res.json({ success: true, message: 'Appointment cancelled successfully' });
});

// @route  PUT /api/appointments/webhook/reply
// @desc   Twilio webhook — patient replies CONFIRM/CANCEL on WhatsApp
// @access Public (Twilio calls this)
const handleWhatsAppReply = asyncHandler(async (req, res) => {
  const { From, Body } = req.body;
  const reply = Body?.trim().toUpperCase();
  const phone = From?.replace('whatsapp:', '');

  // Find the most recent scheduled appointment for this patient
  const patient = await Patient.findOne({ phone });
  if (!patient) return res.sendStatus(200);

  const appointment = await Appointment.findOne({
    patientId: patient._id,
    status: { $in: ['scheduled', 'confirmed'] },
  }).sort({ date: 1 });

  if (!appointment) return res.sendStatus(200);

  if (reply === 'CONFIRM') {
    appointment.status = 'confirmed';
    await appointment.save();
    await sendWhatsApp(phone, `✅ Great! Your appointment on *${appointment.date}* at *${appointment.timeSlot}* is confirmed. See you then!`);
  } else if (reply === 'CANCEL') {
    appointment.status = 'cancelled';
    await appointment.save();
    await sendWhatsApp(phone, `❌ Your appointment on *${appointment.date}* at *${appointment.timeSlot}* has been cancelled. Call us to reschedule.`);
  }

  res.sendStatus(200);
});

module.exports = { getAppointments, getTodayAppointments, getSlots, bookAppointment, updateStatus, deleteAppointment, handleWhatsAppReply };
