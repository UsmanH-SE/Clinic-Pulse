const Billing = require('../models/Billing');
const Appointment = require('../models/Appointment');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @route  GET /api/billing
// @desc   Get all billing records for a clinic
// @access Private
const getBilling = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = { clinicId: req.user.clinicId };
  if (status) filter.status = status;

  const total = await Billing.countDocuments(filter);
  const records = await Billing.find(filter)
    .populate('patientId', 'name phone')
    .populate('appointmentId', 'date timeSlot')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, total, page: Number(page), records });
});

// @route  POST /api/billing/add
// @desc   Create a billing record for a visit
// @access Private
const addBill = asyncHandler(async (req, res) => {
  const { patientId, appointmentId, amount, paymentMethod } = req.body;

  if (!patientId || !appointmentId || !amount) {
    res.status(400);
    throw new Error('Patient, appointment and amount are required');
  }

  // Prevent duplicate billing for same appointment
  const exists = await Billing.findOne({ appointmentId });
  if (exists) { res.status(400); throw new Error('Bill already exists for this appointment'); }

  const bill = await Billing.create({
    clinicId:      req.user.clinicId,
    patientId,
    appointmentId,
    amount:        Number(amount),
    status:        'unpaid',
    paymentMethod: paymentMethod || 'cash',
  });

  await bill.populate('patientId', 'name phone');
  await bill.populate('appointmentId', 'date timeSlot');

  res.status(201).json({ success: true, bill });
});

// @route  PUT /api/billing/:id/pay
// @desc   Mark a bill as paid
// @access Private
const markPaid = asyncHandler(async (req, res) => {
  const { paymentMethod, partialAmount } = req.body;

  const bill = await Billing.findOne({ _id: req.params.id, clinicId: req.user.clinicId });
  if (!bill) { res.status(404); throw new Error('Bill not found'); }

  bill.status        = partialAmount ? 'partial' : 'paid';
  bill.paidAt        = new Date();
  if (paymentMethod) bill.paymentMethod = paymentMethod;
  if (partialAmount) bill.amount = Number(partialAmount);

  await bill.save();
  res.json({ success: true, bill });
});

// @route  GET /api/billing/summary
// @desc   Revenue summary — daily / weekly / monthly
// @access Private / Admin
const getSummary = asyncHandler(async (req, res) => {
  const { period = 'daily' } = req.query;
  const clinicId = req.user.clinicId;

  const now = new Date();
  let startDate;
  if (period === 'daily')   startDate = new Date(now.setHours(0,0,0,0));
  if (period === 'weekly')  startDate = new Date(now - 7  * 24*60*60*1000);
  if (period === 'monthly') startDate = new Date(now - 30 * 24*60*60*1000);

  const records = await Billing.find({
    clinicId,
    createdAt: { $gte: startDate },
  });

  const totalRevenue = records.filter(r => r.status === 'paid').reduce((s, r) => s + r.amount, 0);
  const totalUnpaid  = records.filter(r => r.status === 'unpaid').reduce((s, r) => s + r.amount, 0);
  const totalBills   = records.length;
  const paidCount    = records.filter(r => r.status === 'paid').length;

  res.json({
    success: true,
    period,
    summary: { totalRevenue, totalUnpaid, totalBills, paidCount, unpaidCount: totalBills - paidCount },
  });
});

module.exports = { getBilling, addBill, markPaid, getSummary };
