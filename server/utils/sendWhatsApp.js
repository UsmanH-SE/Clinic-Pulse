const { getTwilioClient } = require('../config/twilio');

const sendWhatsApp = async (to, message) => {
  const client = getTwilioClient();
  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: formattedTo,
    body: message,
  });
};

const sendSMS = async (to, message) => {
  const client = getTwilioClient();
  await client.messages.create({
    from: process.env.TWILIO_SMS_FROM,
    to,
    body: message,
  });
};

module.exports = { sendWhatsApp, sendSMS };
