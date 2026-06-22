const User = require('./User');
const AIAgent = require('./AIAgent');
const Call = require('./Call');
const Appointment = require('./Appointment');
const Lead = require('./Lead');
const Metric = require('./Metric');
const Notification = require('./Notification');

module.exports = () => {
  // Define associations
  User.hasMany(AIAgent, { foreignKey: 'userId', as: 'agents' });
  AIAgent.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

  User.hasMany(Call, { foreignKey: 'userId', as: 'calls' });
  Call.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

  AIAgent.hasMany(Call, { foreignKey: 'agentId', as: 'calls' });
  Call.belongsTo(AIAgent, { foreignKey: 'agentId', as: 'agent' });

  AIAgent.hasMany(Appointment, { foreignKey: 'agentId', as: 'appointments' });
  Appointment.belongsTo(AIAgent, { foreignKey: 'agentId', as: 'agent' });

  Call.hasOne(Appointment, { foreignKey: 'callId', as: 'appointment' });
  Appointment.belongsTo(Call, { foreignKey: 'callId', as: 'call' });

  User.hasMany(Lead, { foreignKey: 'userId', as: 'leads' });
  Lead.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

  AIAgent.hasMany(Lead, { foreignKey: 'agentId', as: 'leads' });
  Lead.belongsTo(AIAgent, { foreignKey: 'agentId', as: 'agent' });

  Call.hasOne(Lead, { foreignKey: 'callId', as: 'lead' });
  Lead.belongsTo(Call, { foreignKey: 'callId', as: 'call' });

  User.hasMany(Metric, { foreignKey: 'userId', as: 'metrics' });
  Metric.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

  AIAgent.hasMany(Metric, { foreignKey: 'agentId', as: 'metrics' });
  Metric.belongsTo(AIAgent, { foreignKey: 'agentId', as: 'agent' });

  User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
  Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
};
