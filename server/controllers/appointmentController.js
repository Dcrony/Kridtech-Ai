
const AIAgent = require('../models/AIAgent');
const Call = require('../models/Call');
const Appointment = require('../models/Appointment');
const Lead = require('../models/Lead');

const { Op } = require('sequelize');
const dayjs = require('dayjs');
const notificationService = require('../services/notificationService');

exports.getAppointments = async (req, res, next) => {
  try {
    const { status, agentId, startDate, endDate, page = 1, limit = 20 } = req.query;
    const where = { userId: req.user.id };

    if (status) where.status = status;
    if (agentId) where.agentId = agentId;
    if (startDate && endDate) {
      where.scheduledDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where,
      include: [
        { model: AIAgent, as: 'agent', attributes: ['id', 'name'] },
        { model: Call, as: 'call', required: false, attributes: ['id', 'callerName', 'callerNumber'] }
      ],
      order: [['scheduledDate', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: appointments,
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

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { model: AIAgent, as: 'agent' },
        { model: Call, as: 'call' }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

exports.createAppointment = async (req, res, next) => {
  try {
    const appointmentData = {
      ...req.body,
      userId: req.user.id,
      source: 'manual'
    };

    const appointment = await Appointment.create(appointmentData);

    // Send notification
    await notificationService.sendAppointmentConfirmation(req.user.id, appointment);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const allowedUpdates = [
      'contactName', 'contactPhone', 'contactEmail', 'title', 'description',
      'scheduledDate', 'duration', 'status', 'notes', 'calendarEventId', 'calendarProvider'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        appointment[field] = req.body[field];
      }
    });

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.status = 'canceled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment canceled successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getCalendar = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const startOfMonth = dayjs(`${year}-${month}-01`).startOf('month').toDate();
    const endOfMonth = dayjs(`${year}-${month}-01`).endOf('month').toDate();

    const appointments = await Appointment.findAll({
      where: {
        userId: req.user.id,
        scheduledDate: { [Op.between]: [startOfMonth, endOfMonth] },
        status: { [Op.not]: 'canceled' }
      },
      include: [
        { model: AIAgent, as: 'agent', attributes: ['id', 'name'] }
      ],
      order: [['scheduledDate', 'ASC']]
    });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

exports.getUpcoming = async (req, res, next) => {
  try {
    const now = new Date();
    const next24h = dayjs().add(24, 'hour').toDate();

    const appointments = await Appointment.findAll({
      where: {
        userId: req.user.id,
        scheduledDate: { [Op.between]: [now, next24h] },
        status: { [Op.in]: ['scheduled', 'confirmed'] }
      },
      include: [
        { model: AIAgent, as: 'agent', attributes: ['id', 'name'] },
        { model: Call, as: 'call', required: false }
      ],
      order: [['scheduledDate', 'ASC']],
      limit: 10
    });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};


