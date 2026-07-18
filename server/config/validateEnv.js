const requiredInProduction = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET'
];

function validateEnv() {
  const env = process.env.NODE_ENV || 'development';

  if (env === 'production') {
    const missing = requiredInProduction.filter((k) => !process.env[k]);
    if (!process.env.PORT) missing.push('PORT');

    // Allow DATABASE_URL as alternative
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    const hasDbVars = requiredInProduction.every((k) => !!process.env[k]);

    if (!hasDatabaseUrl && !hasDbVars) {
      console.error('🚨 Missing required production environment variables:', missing.join(', '));
      console.error('Provide either DATABASE_URL or all of:', requiredInProduction.join(', '));
      process.exit(1);
    }

    if (!process.env.JWT_SECRET) {
      console.error('🚨 Missing required production environment variable: JWT_SECRET');
      process.exit(1);
    }
  } else {
    // Development warnings
    if (!process.env.JWT_SECRET) {
      console.warn('⚠️  JWT_SECRET not set — recommended for local development');
    }
  }

  // Optional but useful warnings
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY is not set — some features may be disabled');
  }
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('⚠️  TWILIO credentials are not set — Twilio features will be disabled');
  }
}

module.exports = validateEnv;
