const { sequelize } = require('../config/database');
const { User, AIAgent, Call, Appointment, Lead, Metric, Notification } = require('../models');

const setupDatabase = async () => {
  try {
    console.log('Setting up database...');
    
    // Force sync (drops and recreates tables - use with caution)
    await sequelize.sync({ force: true });
    
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

