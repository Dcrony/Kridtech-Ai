const { AIAgent, Call, Appointment, Lead } = require('../models/Index');
const { Op } = require('sequelize');

exports.createAgent = async (req, res, next) => {
  try {
    const agentData = {
      ...req.body,
      userId: req.user.id
    };

    const agent = await AIAgent.create(agentData);

    res.status(201).json({
      success: true,
      message: 'AI Agent created successfully',
      data: agent
    });
  } catch (error) {
    next(error);
  }
};

exports.getAgents = async (req, res, next) => {
  try {
    const { status, type, search, page = 1, limit = 20 } = req.query;
    const where = { userId: req.user.id };

    if (status) where.status = status;
    if (type) where.type = type;
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows: agents } = await AIAgent.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: agents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAgent = async (req, res, next) => {
  try {
    const agent = await AIAgent.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { model: Call, as: 'calls', limit: 10, order: [['createdAt', 'DESC']] },
        { model: Appointment, as: 'appointments', limit: 5, order: [['createdAt', 'DESC']] }
      ]
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAgent = async (req, res, next) => {
  try {
    const agent = await AIAgent.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    const allowedUpdates = [
      'name', 'status', 'greeting', 'farewell', 'knowledgeBase', 'faqs',
      'customScripts', 'qualificationRules', 'appointmentSettings',
      'handoffTriggers', 'businessHours', 'afterHoursEnabled',
      'maxCallDuration', 'language', 'sentimentThreshold', 'voiceId'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        agent[field] = req.body[field];
      }
    });

    await agent.save();

    res.json({
      success: true,
      message: 'Agent updated successfully',
      data: agent
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAgent = async (req, res, next) => {
  try {
    const agent = await AIAgent.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    agent.status = 'archived';
    agent.isActive = false;
    await agent.save();

    res.json({
      success: true,
      message: 'Agent archived successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getAgentStats = async (req, res, next) => {
  try {
    const agent = await AIAgent.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    const stats = await Call.findAll({
      where: { agentId: agent.id },
      attributes: [
        'status',
        [Call.sequelize.fn('COUNT', '*'), 'count'],
        [Call.sequelize.fn('SUM', Call.sequelize.col('duration')), 'totalDuration'],
        [Call.sequelize.fn('AVG', Call.sequelize.col('duration')), 'avgDuration']
      ],
      group: ['status']
    });

    const recentCalls = await Call.findAll({
      where: { agentId: agent.id },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        agent,
        stats,
        recentCalls
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.cloneVoice = async (req, res, next) => {
  try {
    // Placeholder for voice cloning integration (ElevenLabs)
    const { agentId } = req.params;
    
    res.json({
      success: true,
      message: 'Voice cloning initiated',
      data: {
        agentId,
        status: 'processing',
        estimatedTime: '5 minutes'
      }
    });
  } catch (error) {
    next(error);
  }
};