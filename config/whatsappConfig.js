function cleanEnvValue(value) {
  if (typeof value !== "string") return "";
  // Handles accidental whitespace and accidental surrounding quotes from copy/paste.
  return value.trim().replace(/^["']|["']$/g, "");
}

// Env is loaded once from the repo root `.env` in server.js before this module is imported.
const phoneId = cleanEnvValue(process.env.WHATSAPP_PHONE_ID);
const token = cleanEnvValue(process.env.WHATSAPP_TOKEN);

export default {
  baseURL: `https://graph.facebook.com/v18.0/${phoneId}/messages`,
  token,
};