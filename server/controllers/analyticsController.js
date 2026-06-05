const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');
const Patient = require('../models/Patient');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @route  GET /api/analytics/overview
// @desc   Total appointments, no-show rate, revenue — today / this week
// @access Private / Admin
const getOverview = asyncHandler(async (req, res) => {
  const clinicId = req.user.clinicId;
  const today    = new Date().toISOString().split('T')[0];

  const weekAgo  = new Date(Date.now() - 7 * 24*60*60*1000).toISOString().split('T')[0];

  const [todayAppts, weekAppts, totalPatients, weekBilling] = await Promise.all([
    Appointment.countDocuments({ clinicId, date: today }),
    Appointment.find({ clinicId, date: { $gte: weekAgo } }),
    Patient.countDocuments({ clinicId }),
    Billing.find({ clinicId, createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } }),
  ]);

  const noShows      = weekAppts.filter(a => a.status === 'no-show').length;
  const completed    = weekAppts.filter(a => a.status === 'completed').length;
  const noShowRate   = weekAppts.length ? Math.round((noShows / weekAppts.length) * 100) : 0;
  const weekRevenue  = weekBilling.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0);

  res.json({
    success: true,
    overview: {
      todayAppointments: todayAppts,
      weekAppointments:  weekAppts.length,
      completedThisWeek: completed,
      noShowsThisWeek:   noShows,
      noShowRate:        `${noShowRate}%`,
      weekRevenue,
      totalPatients,
    },
  });
});

// @route  GET /api/analytics/trends
// @desc   Daily revenue & appointment counts for last 7 days
// @access Private / Admin
const getTrends = asyncHandler(async (req, res) => {
  const clinicId = req.user.clinicId;
  const days = 7;
  const trends = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24*60*60*1000);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

    const [appts, bills] = await Promise.all([
      Appointment.countDocuments({ clinicId, date: dateStr }),
      Billing.find({ clinicId, createdAt: { $gte: new Date(d.setHours(0,0,0,0)), $lt: new Date(d.setHours(23,59,59,999)) }, status: 'paid' }),
    ]);

    trends.push({
      date:         dateStr,
      day:          dayLabel,
      appointments: appts,
      revenue:      bills.reduce((s, b) => s + b.amount, 0),
    });
  }

  res.json({ success: true, trends });
});

// @route  GET /api/analytics/busy-slots
// @desc   Most popular time slots (top booked)
// @access Private / Admin
const getBusySlots = asyncHandler(async (req, res) => {
  const clinicId = req.user.clinicId;

  const slotCounts = await Appointment.aggregate([
    { $match: { clinicId, status: { $in: ['completed', 'confirmed', 'scheduled'] } } },
    { $group: { _id: '$timeSlot', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const busySlots = slotCounts.map(s => ({ slot: s._id, count: s.count }));
  res.json({ success: true, busySlots });
});

// @route  GET /api/analytics/no-show-trend
// @desc   No-show count per day for last 30 days
// @access Private / Admin
const getNoShowTrend = asyncHandler(async (req, res) => {
  const clinicId = req.user.clinicId;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24*60*60*1000).toISOString().split('T')[0];

  const noShows = await Appointment.aggregate([
    { $match: { clinicId, status: 'no-show', date: { $gte: thirtyDaysAgo } } },
    { $group: { _id: '$date', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, noShowTrend: noShows.map(n => ({ date: n._id, noShows: n.count })) });
});

module.exports = { getOverview, getTrends, getBusySlots, getNoShowTrend };
