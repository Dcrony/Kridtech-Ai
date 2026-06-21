const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AIAgent = sequelize.define('AIAgent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('inbound', 'outbound', 'support', 'qualifier', 'scheduler', 'after_hours'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'training', 'active', 'paused', 'archived'),
    defaultValue: 'draft'
  },
  voiceId: {
    type: DataTypes.STRING(100)
  },
  voiceCloneUrl: {
    type: DataTypes.STRING(500)
  },
  greeting: {
    type: DataTypes.TEXT
  },
  farewell: {
    type: DataTypes.TEXT
  },
  knowledgeBase: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  faqs: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  customScripts: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  qualificationRules: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  appointmentSettings: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  handoffTriggers: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  businessHours: {
    type: DataTypes.JSONB,
    defaultValue: {
      monday: { start: '09:00', end: '17:00', enabled: true },
      tuesday: { start: '09:00', end: '17:00', enabled: true },
      wednesday: { start: '09:00', end: '17:00', enabled: true },
      thursday: { start: '09:00', end: '17:00', enabled: true },
      friday: { start: '09:00', end: '17:00', enabled: true },
      saturday: { start: '09:00', end: '13:00', enabled: false },
      sunday: { start: '09:00', end: '13:00', enabled: false }
    }
  },
  afterHoursEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  maxCallDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 600 // 10 minutes
  },
  language: {
    type: DataTypes.STRING(10),
    defaultValue: 'en-US'
  },
  sentimentThreshold: {
    type: DataTypes.FLOAT,
    defaultValue: 0.3
  },
  totalCallsHandled: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalMinutesUsed: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  successRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'ai_agents'
});

module.exports = AIAgent;
