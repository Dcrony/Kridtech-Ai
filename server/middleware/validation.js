const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }),
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    phone: Joi.string().optional(),
    companyName: Joi.string().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  createAgent: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    type: Joi.string().valid('inbound', 'outbound', 'support', 'qualifier', 'scheduler', 'after_hours').required(),
    greeting: Joi.string().optional(),
    farewell: Joi.string().optional(),
    knowledgeBase: Joi.object().optional(),
    faqs: Joi.array().optional(),
    businessHours: Joi.object().optional(),
    afterHoursEnabled: Joi.boolean().optional(),
    language: Joi.string().optional()
  }),

  updateAgent: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    status: Joi.string().valid('draft', 'training', 'active', 'paused', 'archived').optional(),
    greeting: Joi.string().optional(),
    farewell: Joi.string().optional(),
    knowledgeBase: Joi.object().optional(),
    faqs: Joi.array().optional(),
    customScripts: Joi.array().optional(),
    qualificationRules: Joi.object().optional(),
    appointmentSettings: Joi.object().optional(),
    handoffTriggers: Joi.array().optional(),
    businessHours: Joi.object().optional(),
    afterHoursEnabled: Joi.boolean().optional(),
    maxCallDuration: Joi.number().optional(),
    language: Joi.string().optional(),
    sentimentThreshold: Joi.number().optional()
  }),

  createCall: Joi.object({
    agentId: Joi.string().uuid().required(),
    direction: Joi.string().valid('inbound', 'outbound').required(),
    callerNumber: Joi.string().optional(),
    callerName: Joi.string().optional()
  }),

  updateCall: Joi.object({
    status: Joi.string().valid('queued', 'ringing', 'in_progress', 'completed', 'failed', 'no_answer', 'busy', 'canceled', 'handoff').optional(),
    transcript: Joi.string().optional(),
    summary: Joi.string().optional(),
    sentiment: Joi.string().valid('positive', 'neutral', 'negative').optional(),
    sentimentScore: Joi.number().optional(),
    leadScore: Joi.number().optional(),
    isQualified: Joi.boolean().optional(),
    qualificationData: Joi.object().optional(),
    appointmentBooked: Joi.boolean().optional(),
    handoffReason: Joi.string().optional(),
    handoffTo: Joi.string().uuid().optional(),
    notes: Joi.string().optional(),
    tags: Joi.array().optional()
  }),

  createAppointment: Joi.object({
    callId: Joi.string().uuid().optional(),
    agentId: Joi.string().uuid().required(),
    contactName: Joi.string().required(),
    contactPhone: Joi.string().required(),
    contactEmail: Joi.string().email().optional(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    scheduledDate: Joi.date().required(),
    duration: Joi.number().optional()
  }),

  updateLead: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    company: Joi.string().optional(),
    status: Joi.string().valid('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'nurture').optional(),
    score: Joi.number().optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    estimatedValue: Joi.number().optional(),
    notes: Joi.string().optional(),
    assignedTo: Joi.string().uuid().optional(),
    customFields: Joi.object().optional(),
    tags: Joi.array().optional()
  })
};

module.exports = { validate, schemas };
