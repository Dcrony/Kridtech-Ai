const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Metric = sequelize.define('Metric', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  totalCalls: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  inboundCalls: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  outboundCalls: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalMinutes: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  avgCallDuration: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 4),
    defaultValue: 0
  },
  qualifiedLeads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  appointmentsBooked: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  handoffs: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  positiveSentiment: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  negativeSentiment: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  neutralSentiment: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  successRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  peakHour: {
    type: DataTypes.INTEGER
  },
  avgResponseTime: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'metrics'
});

module.exports = Metric;
