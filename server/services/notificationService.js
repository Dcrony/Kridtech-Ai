const { Notification } = require('../models');
const twilioService = require('./twilioService');
const { logger } = require('../middleware/errorHandler');

class NotificationService {
  /**
   * Create and send notification
   */
  async sendNotification({ userId, type, title, message, data = {}, priority = 'medium', channel = 'in_app' }) {
    try {
      // Save to database
      const notification = await Notification.create({
        userId,
        type,
        title,
        message,
        data,
        priority,
        channel
      });

      // Send based on channel
      if (channel === 'sms' || channel === 'all') {
        await this.sendSMS(userId, message);
      }
      
      if (channel === 'email' || channel === 'all') {
        await this.sendEmail(userId, title, message);
      }

      return notification;
    } catch (error) {
      logger.error('Notification error:', error);
      throw error;
    }
  }

  /**
   * Send call alert
   */
  async sendCallAlert(userId, callData) {
    const message = `New call from ${callData.callerName || callData.callerNumber}. Duration: ${callData.duration}s. Intent: ${callData.intent}`;
    
    return this.sendNotification({
      userId,
      type: 'call_alert',
      title: 'New Call Completed',
      message,
      data: callData,
      priority: callData.isQualified ? 'high' : 'medium',
      channel: callData.isQualified ? 'all' : 'in_app'
    });
  }

  /**
   * Send lead alert
   */
  async sendLeadAlert(userId, leadData) {
    const message = `New qualified lead: ${leadData.firstName} ${leadData.lastName} (Score: ${leadData.score})`;
    
    return this.sendNotification({
      userId,
      type: 'lead_alert',
      title: 'Hot Lead Alert',
      message,
      data: leadData,
      priority: leadData.score >= 80 ? 'urgent' : 'high',
      channel: leadData.score >= 80 ? 'all' : 'in_app'
    });
  }

  /**
   * Send handoff notification
   */
  async sendHandoffNotification(userId, handoffData) {
    const message = `Call handoff required: ${handoffData.callerName || 'Unknown'} - ${handoffData.handoffReason}`;
    
    return this.sendNotification({
      userId,
      type: 'handoff',
      title: 'Human Handoff Required',
      message,
      data: handoffData,
      priority: 'urgent',
      channel: 'all'
    });
  }

  /**
   * Send appointment confirmation
   */
  async sendAppointmentConfirmation(userId, appointmentData) {
    const message = `Appointment booked: ${appointmentData.contactName} on ${appointmentData.scheduledDate}`;
    
    return this.sendNotification({
      userId,
      type: 'appointment_alert',
      title: 'New Appointment',
      message,
      data: appointmentData,
      priority: 'medium',
      channel: 'in_app'
    });
  }

  /**
   * Send SMS
   */
  async sendSMS(userId, message) {
    try {
      // In production, fetch user's phone number from database
      // For now, this is a placeholder
      logger.info(`SMS would be sent to user ${userId}: ${message}`);
    } catch (error) {
      logger.error('SMS send error:', error);
    }
  }

  /**
   * Send Email
   */
  async sendEmail(userId, subject, body) {
    try {
      // In production, integrate with email service
      logger.info(`Email would be sent to user ${userId}: ${subject}`);
    } catch (error) {
      logger.error('Email send error:', error);
    }
  }

  /**
   * Get user notifications
   */
  async getNotifications(userId, { page = 1, limit = 20, unreadOnly = false }) {
    const where = { userId };
    if (unreadOnly) where.isRead = false;

    return await Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return notification;
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(userId) {
    await Notification.update(
      { isRead: true, readAt: new Date() },
      { where: { userId, isRead: false } }
    );
  }
}

module.exports = new NotificationService();