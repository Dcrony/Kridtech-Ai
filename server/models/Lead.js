const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lead = sequelize.define('Lead', {
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
  agentId: {
    type: DataTypes.UUID,
    references: { model: 'ai_agents', key: 'id' }
  },
  callId: {
    type: DataTypes.UUID,
    references: { model: 'calls', key: 'id' }
  },
  firstName: {
    type: DataTypes.STRING(100)
  },
  lastName: {
    type: DataTypes.STRING(100)
  },
  email: {
    type: DataTypes.STRING(255)
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  company: {
    type: DataTypes.STRING(200)
  },
  source: {
    type: DataTypes.ENUM('inbound_call', 'outbound_call', 'web_form', 'referral', 'import'),
    defaultValue: 'inbound_call'
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'nurture'),
    defaultValue: 'new'
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  estimatedValue: {
    type: DataTypes.DECIMAL(12, 2)
  },
  notes: {
    type: DataTypes.TEXT
  },
  lastContactDate: {
    type: DataTypes.DATE
  },
  nextFollowUpDate: {
    type: DataTypes.DATE
  },
  assignedTo: {
    type: DataTypes.UUID,
    references: { model: 'users', key: 'id' }
  },
  customFields: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'leads'
});

module.exports = Lead;
