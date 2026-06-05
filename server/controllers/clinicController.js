const Clinic = require('../models/Clinic');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @route  GET /api/clinic
// @desc   Get clinic details
// @access Private
const getClinic = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findById(req.user.clinicId);
  if (!clinic) { res.status(404); throw new Error('Clinic not found'); }
  res.json({ success: true, clinic });
});

// @route  PUT /api/clinic/update
// @desc   Update clinic working hours, slot duration, info
// @access Private / Admin only
const updateClinic = asyncHandler(async (req, res) => {
  const { name, address, phone, specialty, workingHours, slotDuration } = req.body;
  const clinic = await Clinic.findById(req.user.clinicId);
  if (!clinic) { res.status(404); throw new Error('Clinic not found'); }

  if (name)         clinic.name = name;
  if (address)      clinic.address = address;
  if (phone)        clinic.phone = phone;
  if (specialty)    clinic.specialty = specialty;
  if (workingHours) clinic.workingHours = workingHours;
  if (slotDuration) clinic.slotDuration = slotDuration;

  await clinic.save();
  res.json({ success: true, clinic });
});

// @route  GET /api/clinic/slots/:date
// @desc   Get available time slots for a given date
// @access Private
const getAvailableSlots = asyncHandler(async (req, res) => {
  const Appointment = require('../models/Appointment');
  const { date } = req.params;

  const clinic = await Clinic.findById(req.user.clinicId);
  if (!clinic) { res.status(404); throw new Error('Clinic not found'); }

  // Generate all slots based on working hours + slot duration
  const allSlots = generateSlots(
    clinic.workingHours.start,
    clinic.workingHours.end,
    clinic.slotDuration
  );

  // Find already booked slots for this date
  const booked = await Appointment.find({
    clinicId: req.user.clinicId,
    date,
    status: { $in: ['scheduled', 'confirmed'] },
  }).select('timeSlot');

  const bookedSlots = booked.map(a => a.timeSlot);
  const available = allSlots.filter(s => !bookedSlots.includes(s));

  res.json({ success: true, date, allSlots, available, booked: bookedSlots });
});

// Helper: generate time slots
function generateSlots(start, end, durationMins) {
  const slots = [];
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  let current = startH * 60 + startM;
  const endTotal = endH * 60 + endM;
  while (current < endTotal) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    const suffix = h < 12 ? 'AM' : 'PM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    slots.push(`${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`);
    current += durationMins;
  }
  return slots;
}

module.exports = { getClinic, updateClinic, getAvailableSlots };
