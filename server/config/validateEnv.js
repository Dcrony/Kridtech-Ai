function validateEnv() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET environment variable is missing.');
    process.exit(1);
  }

  // Optional warnings
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️ OPENAI_API_KEY is not set — some AI features may be unavailable.');
  }
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('⚠️ TWILIO credentials are not set — Twilio features will be unavailable.');
  }
}

module.exports = validateEnv;
