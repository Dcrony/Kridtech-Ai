const { sequelize } = require('../config/database');
const User = require('../models/User');
const AIAgent = require('../models/AIAgent');
const Call = require('../models/Call');
const Appointment = require('../models/Appointment');
const Lead = require('../models/Lead');
const Metric = require('../models/Metric');
const Notification = require('../models/Notification');

const setupDatabase = async () => {
  try {
    console.log('Setting up database...');
    
    // Create or update tables without dropping existing ones.
    await sequelize.sync({ force: false, alter: false });
    
    console.log('✅ Database tables created successfully');
    console.log('Tables created:');
    console.log('  - users');
    console.log('  - ai_agents');
    console.log('  - calls');
    console.log('  - appointments');
    console.log('  - leads');
    console.log('  - metrics');
    console.log('  - notifications');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();

