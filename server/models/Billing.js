const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  clinicId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic',      required: true },
  patientId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Patient',     required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: false }, // optional
  amount:        { type: Number, required: true },
  description:   { type: String, default: '' },
  status:        { type: String, enum: ['paid', 'unpaid', 'partial'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'online', 'bank_transfer'], default: 'cash' },
  paidAt:        { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema);
