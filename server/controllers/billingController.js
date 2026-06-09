const Billing = require('../models/Billing');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @route  GET /api/billing
// @desc   Get all billing records for a clinic
// @access Private
const getBilling = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const filter = { clinicId: req.user.clinicId };
  if (status) filter.status = status;

  const total = await Billing.countDocuments(filter);
  const bills = await Billing.find(filter)
    .populate('patientId',     'name phone')
    .populate('appointmentId', 'date timeSlot')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, total, page: Number(page), bills });
});

// @route  POST /api/billing/add
// @desc   Create a billing record
// @access Private
const addBill = asyncHandler(async (req, res) => {
  const { patientId, appointmentId, description, paymentMethod } = req.body;
  // Accept both 'amount' and 'totalAmount' from frontend
  const amount = req.body.amount || req.body.totalAmount;

  if (!patientId || !amount) {
    res.status(400);
    throw new Error('Patient and amount are required');
  }

  // Prevent duplicate billing for same appointment (only if appointmentId provided)
  if (appointmentId) {
    const exists = await Billing.findOne({ appointmentId });
    if (exists) {
      res.status(400);
      throw new Error('Bill already exists for this appointment');
    }
  }

  const bill = await Billing.create({
    clinicId:      req.user.clinicId,
    patientId,
    appointmentId: appointmentId || undefined,
    amount:        Number(amount),
    description:   description || '',
    status:        'unpaid',
    paymentMethod: paymentMethod || 'cash',
  });

  await bill.populate('patientId',     'name phone');
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
  if (paymentMethod)  bill.paymentMethod = paymentMethod;
  if (partialAmount)  bill.amount        = Number(partialAmount);

  await bill.save();
  res.json({ success: true, bill });
});

// @route  GET /api/billing/summary
// @desc   Revenue summary — daily / weekly / monthly
// @access Private / Admin
const getSummary = asyncHandler(async (req, res) => {
  const { period = 'monthly' } = req.query;
  const clinicId = req.user.clinicId;

  const now = new Date();
  let startDate;
  if (period === 'daily')   startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === 'weekly')  startDate = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000);
  if (period === 'monthly') startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const records = await Billing.find({ clinicId, createdAt: { $gte: startDate } });

  const totalRevenue  = records.filter(r => r.status === 'paid').reduce((s, r) => s + r.amount, 0);
  const unpaidRevenue = records.filter(r => r.status !== 'paid').reduce((s, r) => s + r.amount, 0);
  const totalBills    = records.length;
  const paidCount     = records.filter(r => r.status === 'paid').length;

  res.json({
    success: true,
    period,
    // Frontend-compatible keys
    totalRevenue,
    paidRevenue:   totalRevenue,
    unpaidRevenue,
    totalBills,
    paidCount,
    unpaidCount:   totalBills - paidCount,
  });
});

module.exports = { getBilling, addBill, markPaid, getSummary };
