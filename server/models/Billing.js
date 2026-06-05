const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'unpaid', 'partial'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'online'], default: 'cash' },
  paidAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema);
