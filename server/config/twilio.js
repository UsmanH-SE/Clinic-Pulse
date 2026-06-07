// Twilio is OPTIONAL — if credentials are not set, messaging is silently skipped.
// Add real credentials to .env when you create a Twilio account.

let client = null;

const getTwilioClient = () => {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token || !sid.startsWith('AC')) return null;
  if (!client) client = require('twilio')(sid, token);
  return client;
};

const isTwilioEnabled = () => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  return !!(sid && sid.startsWith('AC'));
};

module.exports = { getTwilioClient, isTwilioEnabled };
