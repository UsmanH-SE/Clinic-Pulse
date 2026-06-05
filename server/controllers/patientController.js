const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @route  GET /api/patients
// @desc   List all patients for the clinic (with search)
// @access Private
const getPatients = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const filter = { clinicId: req.user.clinicId };

  if (search) {
    filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Patient.countDocuments(filter);
  const patients = await Patient.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, total, page: Number(page), patients });
});

// @route  POST /api/patients/add
// @desc   Add a new patient
// @access Private
const addPatient = asyncHandler(async (req, res) => {
  const { name, phone, age, gender, medicalHistory } = req.body;

  if (!name || !phone) {
    res.status(400);
    throw new Error('Name and phone number are required');
  }

  // Check for duplicate phone in same clinic
  const exists = await Patient.findOne({ clinicId: req.user.clinicId, phone });
  if (exists) {
    res.status(400);
    throw new Error('A patient with this phone number already exists');
  }

  const patient = await Patient.create({
    clinicId: req.user.clinicId,
    name,
    phone,
    age:            age            || undefined,
    gender:         gender         || undefined,
    medicalHistory: medicalHistory || '',
  });

  res.status(201).json({ success: true, patient });
});

// @route  GET /api/patients/:id
// @desc   Get a single patient's details
// @access Private
const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id, clinicId: req.user.clinicId });
  if (!patient) { res.status(404); throw new Error('Patient not found'); }
  res.json({ success: true, patient });
});

// @route  PUT /api/patients/:id
// @desc   Update patient info
// @access Private
const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id, clinicId: req.user.clinicId });
  if (!patient) { res.status(404); throw new Error('Patient not found'); }

  const { name, phone, age, gender, medicalHistory } = req.body;
  if (name)           patient.name           = name;
  if (phone)          patient.phone          = phone;
  if (age !== undefined)    patient.age      = age;
  if (gender)         patient.gender         = gender;
  if (medicalHistory !== undefined) patient.medicalHistory = medicalHistory;

  await patient.save();
  res.json({ success: true, patient });
});

// @route  GET /api/patients/:id/history
// @desc   Get a patient's full visit history (appointments + billing)
// @access Private
const getPatientHistory = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id, clinicId: req.user.clinicId });
  if (!patient) { res.status(404); throw new Error('Patient not found'); }

  const appointments = await Appointment.find({
    patientId: req.params.id,
    clinicId:  req.user.clinicId,
  }).sort({ date: -1, timeSlot: -1 });

  const billing = await Billing.find({
    patientId: req.params.id,
    clinicId:  req.user.clinicId,
  }).sort({ createdAt: -1 });

  res.json({ success: true, patient, appointments, billing });
});

// @route  DELETE /api/patients/:id
// @desc   Delete a patient record
// @access Private / Admin only
const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOneAndDelete({ _id: req.params.id, clinicId: req.user.clinicId });
  if (!patient) { res.status(404); throw new Error('Patient not found'); }
  res.json({ success: true, message: 'Patient deleted successfully' });
});

module.exports = { getPatients, addPatient, getPatient, updatePatient, getPatientHistory, deletePatient };
