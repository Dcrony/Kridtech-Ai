const { Sequelize } = require('sequelize');
require('dotenv').config();

const createPostgresSequelize = () => {
  const ssl = process.env.DB_SSL === 'true' || /sslmode=require/.test(process.env.DATABASE_URL);
  const dialectOptions = ssl ? { ssl: { require: true, rejectUnauthorized: false } } : {};

  return new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions,
  });
};

const sequelize = createPostgresSequelize();

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
