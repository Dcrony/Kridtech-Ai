const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sqliteStorage = process.env.SQLITE_STORAGE || path.join(__dirname, '..', 'data', 'kridtech.sqlite');
const shouldUseSqlite = process.env.DB_DIALECT === 'sqlite' || process.env.DB_USE_SQLITE === 'true';

const createPostgresSequelize = () => {
  const ssl = process.env.DB_SSL === 'true';
  const dialectOptions = ssl ? { ssl: { require: true, rejectUnauthorized: false } } : {};

  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions,
    });
  }

  return new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions,
  });
};

const createSqliteSequelize = () => new Sequelize({
  dialect: 'sqlite',
  storage: sqliteStorage,
  logging: false,
});

let sequelize = shouldUseSqlite ? createSqliteSequelize() : createPostgresSequelize();

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Database connection established successfully via ${sequelize.getDialect()}.`);
  } catch (error) {
    // In production we must not fall back to SQLite. Fail fast with clear error.
    if (process.env.NODE_ENV === 'production' && !shouldUseSqlite) {
      console.error('❌ Unable to connect to Postgres in production:', error.message);
      throw error;
    }

    // Non-production: allow explicit fallback to SQLite when requested via DB_USE_SQLITE
    if (process.env.DB_USE_SQLITE === 'true' && !shouldUseSqlite) {
      console.warn('⚠️ Falling back to local SQLite because the remote database is unavailable:', error.message);
      sequelize = createSqliteSequelize();
      await sequelize.authenticate();
      console.log('✅ SQLite fallback connection established.');
      return;
    }

    console.error('❌ Unable to connect to the database:', error.message);
    throw error;
  }
};

module.exports = { sequelize, testConnection };
