const twilio = require('twilio');

let client = null;

const getTwilioClient = () => {
  if (!client) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return client;
};

module.exports = { getTwilioClient };
