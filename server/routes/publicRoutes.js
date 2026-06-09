const express = require('express');
const router  = express.Router();
const Clinic      = require('../models/Clinic');
const Patient     = require('../models/Patient');
const Appointment = require('../models/Appointment');
const { asyncHandler } = require('../middleware/errorMiddleware');

// ─────────────────────────────────────────────
// GET /api/public/clinics/search?name=ahmed
// Search clinics by name — no auth needed
// ─────────────────────────────────────────────
router.get('/clinics/search', asyncHandler(async (req, res) => {
  const { name = '' } = req.query;
  if (!name.trim()) return res.json({ success: true, clinics: [] });

  const clinics = await Clinic.find({
    name: { $regex: name.trim(), $options: 'i' },
  })
    .select('_id name address specialty phone')
    .limit(10);

  res.json({ success: true, clinics });
}));

// ─────────────────────────────────────────────
// GET /api/public/clinics/:clinicId
// Get one clinic info — no auth needed
// ─────────────────────────────────────────────
router.get('/clinics/:clinicId', asyncHandler(async (req, res) => {
  const clinic = await Clinic.findById(req.params.clinicId)
    .select('_id name address specialty phone workingHours slotDuration');

  if (!clinic) {
    res.status(404);
    throw new Error('Clinic not found');
  }
  res.json({ success: true, clinic });
}));

// ─────────────────────────────────────────────
// GET /api/public/slots?clinicId=...&date=...
// Available time slots for a clinic on a date — no auth
// ─────────────────────────────────────────────
router.get('/slots', asyncHandler(async (req, res) => {
  const { clinicId, date } = req.query;

  if (!clinicId || !date) {
    res.status(400);
    throw new Error('clinicId and date are required');
  }

  const allSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM',
  ];

  const booked = await Appointment.find({
    clinicId,
    date,
    status: { $in: ['scheduled', 'confirmed'] },
  }).select('timeSlot');

  const bookedSlots     = booked.map(a => a.timeSlot);
  const availableSlots  = allSlots.filter(s => !bookedSlots.includes(s));

  res.json({ success: true, date, availableSlots, bookedSlots });
}));

// ─────────────────────────────────────────────
// POST /api/public/book
// Patient books an appointment — no auth needed
// Body: { clinicId, patientName, patientPhone, date, timeSlot, notes }
// ─────────────────────────────────────────────
router.post('/book', asyncHandler(async (req, res) => {
  const { clinicId, patientName, patientPhone, date, timeSlot, notes } = req.body;

  if (!clinicId || !patientName || !patientPhone || !date || !timeSlot) {
    res.status(400);
    throw new Error('Clinic, name, phone, date and time slot are required');
  }

  // Verify clinic exists
  const clinic = await Clinic.findById(clinicId);
  if (!clinic) {
    res.status(404);
    throw new Error('Clinic not found');
  }

  // Check if slot is still free
  const conflict = await Appointment.findOne({
    clinicId,
    date,
    timeSlot,
    status: { $in: ['scheduled', 'confirmed'] },
  });
  if (conflict) {
    res.status(409);
    throw new Error('This time slot was just taken. Please choose another slot.');
  }

  // Find existing patient by phone, or create new one
  let patient = await Patient.findOne({ clinicId, phone: patientPhone });
  if (!patient) {
    patient = await Patient.create({
      clinicId,
      name:   patientName,
      phone:  patientPhone,
      gender: 'Other',
    });
  } else {
    // Update name in case they provided a different one
    patient.name = patientName;
    await patient.save();
  }

  // Create appointment
  const appointment = await Appointment.create({
    clinicId,
    patientId:  patient._id,
    date,
    timeSlot,
    notes:      notes || '',
    status:     'scheduled',
    createdBy:  'patient',
  });

  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully!',
    appointment: {
      _id:        appointment._id,
      date:       appointment.date,
      timeSlot:   appointment.timeSlot,
      clinicName: clinic.name,
      patientName: patient.name,
    },
  });
}));

module.exports = router;
