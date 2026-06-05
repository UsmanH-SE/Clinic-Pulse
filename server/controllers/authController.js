const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const { asyncHandler } = require('../middleware/errorMiddleware');

// ─── Generate JWT Token ───────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// ─── @route  POST /api/auth/register ─────────────────────────────────────────
// @desc    Register a new clinic + admin user
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { clinicName, clinicAddress, clinicPhone, specialty, name, email, password } = req.body;

  if (!clinicName || !clinicAddress || !clinicPhone || !name || !email || !password) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const clinic = await Clinic.create({
    name: clinicName,
    address: clinicAddress,
    phone: clinicPhone,
    specialty: specialty || 'gp',
  });

  const user = await User.create({
    clinicId: clinic._id,
    name,
    email,
    password,
    role: 'admin',
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      clinicId: clinic._id,
      clinicName: clinic.name,
    },
  });
});

// ─── @route  POST /api/auth/login ─────────────────────────────────────────────
// @desc    Login admin or receptionist
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.isActive) {
    res.status(401);
    throw new Error('Invalid credentials or account is inactive');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const clinic = await Clinic.findById(user.clinicId);
  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      clinicId: user.clinicId,
      clinicName: clinic?.name || '',
    },
  });
});

// ─── @route  GET /api/auth/me ──────────────────────────────────────────────────
// @desc    Get current logged-in user profile
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const clinic = await Clinic.findById(user.clinicId);

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      clinicId: user.clinicId,
      clinicName: clinic?.name || '',
    },
  });
});

// ─── @route  POST /api/auth/add-staff ─────────────────────────────────────────
// @desc    Admin adds a receptionist to their clinic
// @access  Private / Admin only
const addStaff = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email already in use');
  }

  const staff = await User.create({
    clinicId: req.user.clinicId,
    name,
    email,
    password,
    role: 'receptionist',
  });

  res.status(201).json({
    success: true,
    staff: {
      id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
    },
  });
});

// ─── @route  GET /api/auth/staff ──────────────────────────────────────────────
// @desc    Get all staff members for a clinic
// @access  Private / Admin only
const getStaff = asyncHandler(async (req, res) => {
  const staff = await User.find({ clinicId: req.user.clinicId }).select('-password');
  res.json({ success: true, count: staff.length, staff });
});

// ─── @route  PUT /api/auth/staff/:id/toggle ───────────────────────────────────
// @desc    Activate / deactivate a staff member
// @access  Private / Admin only
const toggleStaff = asyncHandler(async (req, res) => {
  const staff = await User.findOne({ _id: req.params.id, clinicId: req.user.clinicId });

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  staff.isActive = !staff.isActive;
  await staff.save();

  res.json({
    success: true,
    message: `Staff ${staff.isActive ? 'activated' : 'deactivated'}`,
    isActive: staff.isActive,
  });
});

module.exports = { register, login, getMe, addStaff, getStaff, toggleStaff };
