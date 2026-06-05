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
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
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

// Start cron job for reminders
startReminderJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`));
