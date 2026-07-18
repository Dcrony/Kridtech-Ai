const { sequelize, testConnection } = require('../config/database');
const analyticsService = require('../services/analyticsService');
const User = require('../models/User');
const AIAgent = require('../models/AIAgent');
const Call = require('../models/Call');
const { randomUUID } = require('crypto');

describe('analyticsService data retrieval', () => {
  let user;

  beforeAll(async () => {
    await testConnection();
    await sequelize.sync();

    user = await User.create({
      id: randomUUID(),
      email: 'analytics-test@example.com',
      password: 'TestPass123!',
      firstName: 'Analytics',
      lastName: 'Tester',
      role: 'admin'
    });

    const agent = await AIAgent.create({
      id: randomUUID(),
      userId: user.id,
      name: 'Demo Agent',
      type: 'support',
      status: 'active'
    });

    await Call.create({
      id: randomUUID(),
      userId: user.id,
      agentId: agent.id,
      direction: 'outbound',
      status: 'completed',
      duration: 180,
      cost: 12.5,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });

  it('returns call trend data without DATE_TRUNC errors on SQLite', async () => {
    const result = await analyticsService.getCallsOverTime(user.id, '7d');

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toEqual(expect.objectContaining({
      calls: expect.any(Number),
      minutes: expect.any(Number)
    }));
  });
});
