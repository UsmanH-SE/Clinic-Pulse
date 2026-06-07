/**
 * ClinicPulse — WhatsApp Messaging via Meta Cloud API
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/messages
 *
 * FREE: 1,000 conversations/month
 * No Twilio needed — direct Meta integration
 */

const axios = require('axios');

// ── Format phone number for Meta API ─────────────────────────────────────────
// Meta requires: digits only, no +, no spaces, no dashes
// Examples: "+92 300 1234567" → "923001234567"
//           "0300-1234567"   → "923001234567" (adds Pakistan code)
const formatPhone = (phone) => {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');

  // If starts with 0 (local Pakistani format like 03001234567) → add 92
  if (digits.startsWith('0')) {
    digits = '92' + digits.slice(1);
  }

  return digits;
};

// ── Check if Meta WhatsApp is configured ─────────────────────────────────────
const isWhatsAppEnabled = () => {
  return !!(process.env.META_WA_TOKEN && process.env.META_WA_PHONE_ID);
};

// ── Send a WhatsApp text message ──────────────────────────────────────────────
const sendWhatsApp = async (to, message) => {
  if (!isWhatsAppEnabled()) {
    console.log(`[WhatsApp SKIPPED — not configured] → ${to}`);
    return;
  }

  const phone = formatPhone(to);
  const url   = `https://graph.facebook.com/v20.0/${process.env.META_WA_PHONE_ID}/messages`;

  try {
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        recipient_type:    'individual',
        to:                phone,
        type:              'text',
        text: {
          preview_url: false,
          body:        message,
        },
      },
      {
        headers: {
          Authorization:  `Bearer ${process.env.META_WA_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`[WhatsApp ✅ SENT] → ${phone} | Message ID: ${response.data?.messages?.[0]?.id}`);
    return response.data;

  } catch (err) {
    const errorMsg = err.response?.data?.error?.message || err.message;
    const errorCode = err.response?.data?.error?.code;
    console.error(`[WhatsApp ❌ FAILED] → ${phone} | Code: ${errorCode} | ${errorMsg}`);

    // Common error codes for developers
    if (errorCode === 131030) console.error('  → Phone number not in allowed test recipients. Add it in Meta dashboard.');
    if (errorCode === 190)    console.error('  → Access token expired! Generate a new one from Meta dashboard.');
    if (errorCode === 131047) console.error('  → Message blocked: more than 24 hours since last customer message (use template).');

    throw err;
  }
};

// ── Send SMS (fallback — not needed with Meta, kept for compatibility) ─────────
const sendSMS = async (to, message) => {
  // Meta WhatsApp replaces SMS — this is a no-op fallback
  console.log(`[SMS fallback] → ${to} (not sent — using WhatsApp only)`);
};

module.exports = { sendWhatsApp, sendSMS, isWhatsAppEnabled, formatPhone };
