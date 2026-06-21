const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Call = sequelize.define('Call', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
  callSid: {
    type: DataTypes.STRING(100),
    unique: true
  },
  direction: {
    type: DataTypes.ENUM('inbound', 'outbound'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('queued', 'ringing', 'in_progress', 'completed', 'failed', 'no_answer', 'busy', 'canceled', 'handoff'),
    defaultValue: 'queued'
  },
  callerNumber: {
    type: DataTypes.STRING(20)
  },
  callerName: {
    type: DataTypes.STRING(200)
  },
  callerLocation: {
    type: DataTypes.STRING(100)
  },
  duration: {
    type: DataTypes.INTEGER, // in seconds
    defaultValue: 0
  },
  cost: {
    type: DataTypes.DECIMAL(10, 4),
    defaultValue: 0
  },
  recordingUrl: {
    type: DataTypes.STRING(500)
  },
  transcript: {
    type: DataTypes.TEXT
  },
  summary: {
    type: DataTypes.TEXT
  },
  sentiment: {
    type: DataTypes.ENUM('positive', 'neutral', 'negative')
  },
  sentimentScore: {
    type: DataTypes.FLOAT
  },
  intent: {
    type: DataTypes.STRING(100)
  },
  leadScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isQualified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  qualificationData: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  appointmentBooked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  appointmentData: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  handoffReason: {
    type: DataTypes.STRING(200)
  },
  handoffTo: {
    type: DataTypes.UUID,
    references: { model: 'users', key: 'id' }
  },
  handoffNotes: {
    type: DataTypes.TEXT
  },
  followUpRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  followUpDate: {
    type: DataTypes.DATE
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT
  },
  aiConfidence: {
    type: DataTypes.FLOAT
  },
  conversationLog: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  startedAt: {
    type: DataTypes.DATE
  },
  endedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'calls'
});

module.exports = Call;
