const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'scheduled',
  },
  notes: { type: String, default: '' },
  reminderSent: {
    hours24: { type: Boolean, default: false },
    hours2: { type: Boolean, default: false },
  },
  createdBy: { type: String, enum: ['patient', 'receptionist'], default: 'receptionist' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
