const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'male', 'female', 'other'] },
  medicalHistory: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
