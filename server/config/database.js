const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sqliteStorage = process.env.SQLITE_STORAGE || path.join(__dirname, '..', 'data', 'kridtech.sqlite');
const shouldUseSqlite = process.env.DB_DIALECT === 'sqlite' || process.env.DB_USE_SQLITE === 'true';

const createPostgresSequelize = () => new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions:
      process.env.DB_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
  }
);

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
    if (process.env.DB_USE_SQLITE !== 'false' && !shouldUseSqlite) {
      console.warn('⚠️ Falling back to local SQLite because the remote database is unavailable:', error.message);
      sequelize = createSqliteSequelize();
      await sequelize.authenticate();
      console.log('✅ SQLite fallback connection established.');
    } else {
      console.error('❌ Unable to connect to the database:', error.message);
      throw error;
    }
  }
};

module.exports = { sequelize, testConnection };
