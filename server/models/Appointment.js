const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  callId: {
    type: DataTypes.UUID,
    references: { model: 'calls', key: 'id' }
  },
  agentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'ai_agents', key: 'id' }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  contactName: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  contactPhone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  contactEmail: {
    type: DataTypes.STRING(255)
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 30 // minutes
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'confirmed', 'completed', 'canceled', 'rescheduled', 'no_show'),
    defaultValue: 'scheduled'
  },
  calendarEventId: {
    type: DataTypes.STRING(200)
  },
  calendarProvider: {
    type: DataTypes.ENUM('google', 'outlook', 'calcom', 'custom')
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reminderSentAt: {
    type: DataTypes.DATE
  },
  notes: {
    type: DataTypes.TEXT
  },
  source: {
    type: DataTypes.ENUM('ai_agent', 'manual', 'web_form'),
    defaultValue: 'ai_agent'
  }
}, {
  tableName: 'appointments'
});

module.exports = Appointment;
