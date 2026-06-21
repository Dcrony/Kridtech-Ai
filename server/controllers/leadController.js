const { Lead, Call, AIAgent } = require('../models');
const { Op } = require('sequelize');
const notificationService = require('../services/notificationService');

exports.getLeads = async (req, res, next) => {
  try {
    const { status, priority, source, search, assignedTo, page = 1, limit = 20 } = req.query;
    const where = { userId: req.user.id, isActive: true };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (source) where.source = source;
    if (assignedTo) where.assignedTo = assignedTo;
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: leads } = await Lead.findAndCountAll({
      where,
      include: [
        { model: AIAgent, as: 'agent', attributes: ['id', 'name'] },
        { model: Call, as: 'call', required: false }
      ],
      order: [['score', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: leads,
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

exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { model: AIAgent, as: 'agent' },
        { model: Call, as: 'call' }
      ]
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

exports.createLead = async (req, res, next) => {
  try {
    const leadData = {
      ...req.body,
      userId: req.user.id,
      source: 'manual'
    };

    const lead = await Lead.create(leadData);

    // Send notification for high-priority leads
    if (lead.priority === 'high' || lead.priority === 'urgent') {
      await notificationService.sendLeadAlert(req.user.id, lead);
    }

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'email', 'phone', 'company',
      'status', 'score', 'priority', 'estimatedValue', 'notes',
      'assignedTo', 'customFields', 'tags', 'nextFollowUpDate'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        lead[field] = req.body[field];
      }
    });

    lead.lastContactDate = new Date();
    await lead.save();

    // Send notification if status changed to qualified
    if (req.body.status === 'qualified' && lead.status === 'qualified') {
      await notificationService.sendLeadAlert(req.user.id, lead);
    }

    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    lead.isActive = false;
    await lead.save();

    res.json({
      success: true,
      message: 'Lead archived successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getLeadStats = async (req, res, next) => {
  try {
    const stats = await Lead.findAll({
      where: { userId: req.user.id, isActive: true },
      attributes: [
        'status',
        'priority',
        'source',
        [Lead.sequelize.fn('COUNT', '*'), 'count'],
        [Lead.sequelize.fn('SUM', Lead.sequelize.col('estimated_value')), 'totalValue']
      ],
      group: ['status', 'priority', 'source']
    });

    const pipeline = await Lead.findAll({
      where: { userId: req.user.id, isActive: true },
      attributes: [
        'status',
        [Lead.sequelize.fn('COUNT', '*'), 'count']
      ],
      group: ['status']
    });

    res.json({
      success: true,
      data: {
        breakdown: stats,
        pipeline: pipeline.reduce((acc, curr) => ({
          ...acc,
          [curr.status]: parseInt(curr.dataValues.count)
        }), {})
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.bulkUpdate = async (req, res, next) => {
  try {
    const { ids, updates } = req.body;

    await Lead.update(updates, {
      where: { id: { [Op.in]: ids }, userId: req.user.id }
    });

    res.json({
      success: true,
      message: `${ids.length} leads updated successfully`
    });
  } catch (error) {
    next(error);
  }
};