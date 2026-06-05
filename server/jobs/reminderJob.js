const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const { sendWhatsApp, sendSMS } = require('../utils/sendWhatsApp');

const startReminderJob = () => {
  // Runs every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('[ReminderJob] Checking upcoming appointments...');
    const now = new Date();

    const window24Start = new Date(now.getTime() + 23.5 * 60 * 60 * 1000);
    const window24End = new Date(now.getTime() + 24.5 * 60 * 60 * 1000);

    const window2Start = new Date(now.getTime() + 1.5 * 60 * 60 * 1000);
    const window2End = new Date(now.getTime() + 2.5 * 60 * 60 * 1000);

    const appointments = await Appointment.find({
      status: { $in: ['scheduled', 'confirmed'] },
    }).populate('patientId');

    for (const appt of appointments) {
      const apptDateTime = new Date(`${appt.date} ${appt.timeSlot}`);
      const patient = appt.patientId;
      if (!patient?.phone) continue;

      if (!appt.reminderSent.hours24 && apptDateTime >= window24Start && apptDateTime <= window24End) {
        const msg = `Hello ${patient.name}! Reminder: You have an appointment tomorrow at ${appt.timeSlot}. Reply CONFIRM to confirm or CANCEL to cancel.`;
        try {
          await sendWhatsApp(patient.phone, msg);
          appt.reminderSent.hours24 = true;
          await appt.save();
          console.log(`[ReminderJob] 24hr reminder sent to ${patient.phone}`);
        } catch (err) {
          console.error(`[ReminderJob] WhatsApp failed, trying SMS: ${err.message}`);
          try { await sendSMS(patient.phone, msg); appt.reminderSent.hours24 = true; await appt.save(); } catch (_) {}
        }
      }

      if (!appt.reminderSent.hours2 && apptDateTime >= window2Start && apptDateTime <= window2End) {
        const msg = `Hello ${patient.name}! Your appointment is in 2 hours at ${appt.timeSlot}. See you soon!`;
        try {
          await sendWhatsApp(patient.phone, msg);
          appt.reminderSent.hours2 = true;
          await appt.save();
          console.log(`[ReminderJob] 2hr reminder sent to ${patient.phone}`);
        } catch (err) {
          try { await sendSMS(patient.phone, msg); appt.reminderSent.hours2 = true; await appt.save(); } catch (_) {}
        }
      }
    }
  });

  console.log('[ReminderJob] Scheduler started (every 30 minutes)');
};

module.exports = { startReminderJob };
