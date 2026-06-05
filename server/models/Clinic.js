const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  specialty: { type: String, enum: ['dental', 'gp', 'eye', 'other'], default: 'gp' },
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '17:00' },
  },
  slotDuration: { type: Number, default: 20 },
}, { timestamps: true });

module.exports = mongoose.model('Clinic', clinicSchema);
