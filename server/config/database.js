const fs = require('fs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Build dialectOptions.ssl carefully to support managed providers that
// present certificates signed by private CAs. We avoid disabling TLS
// verification globally. Supported env helpers:
// - DB_SSL_CA: PEM contents of the CA certificate
// - DB_SSL_CA_FILE: path to a PEM file containing the CA
// - DB_SSL_ALLOW_SELF_SIGNED=true : (NOT recommended) allow self-signed (sets rejectUnauthorized=false)
// - DB_SSL_REJECT_UNAUTHORIZED=false : same as allow self-signed (explicit override)
// - DB_SSL=true : force SSL even if DATABASE_URL doesn't include sslmode
const buildDialectOptions = () => {
  const databaseUrl = process.env.DATABASE_URL || '';
  const sslRequested = process.env.DB_SSL === 'true' || /sslmode=require/.test(databaseUrl);
  if (!sslRequested) return {};

  let ca;
  if (process.env.DB_SSL_CA) {
    ca = process.env.DB_SSL_CA;
  } else if (process.env.DB_SSL_CA_FILE) {
    try {
      ca = fs.readFileSync(process.env.DB_SSL_CA_FILE, 'utf8');
    } catch (err) {
      console.error('❌ Failed to read DB_SSL_CA_FILE:', err.message);
      // Continue — we'll decide on rejectUnauthorized below
    }
  }

  // By default we require valid cert chains. Allow explicit overrides only.
  const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false'
    ? false
    : process.env.DB_SSL_ALLOW_SELF_SIGNED === 'true'
    ? false
    : true;

  // If a CA is provided, use it and enforce rejectUnauthorized policy (recommended)
  if (ca) {
    return { ssl: { ca, rejectUnauthorized } };
  }

  // No CA provided — if the operator explicitly allows self-signed certs,
  // set rejectUnauthorized=false. Otherwise keep strict verification.
  if (!rejectUnauthorized) {
    return { ssl: { rejectUnauthorized: false } };
  }

  return { ssl: { rejectUnauthorized: true } };
};

const dialectOptions = buildDialectOptions();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions,
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Database connection established successfully via ${sequelize.getDialect()}.`);
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error.message);
    throw error;
  }
};

module.exports = { sequelize, testConnection };
