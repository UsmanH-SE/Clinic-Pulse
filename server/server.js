require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { startReminderJob } = require('./jobs/reminderJob');

const app = express();

// Connect Database
connectDB();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/clinic',       require('./routes/clinicRoutes'));
app.use('/api/patients',     require('./routes/patientRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/billing',      require('./routes/billingRoutes'));
app.use('/api/analytics',    require('./routes/analyticsRoutes'));
app.use('/api/reminders',    require('./routes/reminderRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'ClinicPulse API is running ✅', version: '1.0.0' }));

// Error handling
app.use(notFound);
app.use(errorHandler);

// Only start cron job + listen when running locally (not on Vercel serverless)
if (process.env.NODE_ENV !== 'production') {
  startReminderJob();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`));
}

// Export for Vercel serverless
module.exports = app;
