const { Op, fn, col, literal } = require('sequelize');
const { Call, Appointment, Lead, Metric, AIAgent } = require('../models');
const dayjs = require('dayjs');

class AnalyticsService {
  /**
   * Get dashboard overview metrics
   */
  async getDashboardMetrics(userId, period = '7d') {
    const startDate = this.getPeriodStart(period);
    
    const [
      totalCalls,
      callsByStatus,
      totalLeads,
      qualifiedLeads,
      totalAppointments,
      avgCallDuration,
      totalCost,
      sentimentBreakdown,
      callsOverTime,
      topAgents
    ] = await Promise.all([
      Call.count({ where: { userId, createdAt: { [Op.gte]: startDate } } }),
      Call.findAll({
        where: { userId, createdAt: { [Op.gte]: startDate } },
        attributes: ['status', [fn('COUNT', '*'), 'count']],
        group: ['status']
      }),
      Lead.count({ where: { userId, createdAt: { [Op.gte]: startDate } } }),
      Lead.count({ where: { userId, isQualified: true, createdAt: { [Op.gte]: startDate } } }),
      Appointment.count({ where: { userId, createdAt: { [Op.gte]: startDate } } }),
      Call.findOne({
        where: { userId, createdAt: { [Op.gte]: startDate }, duration: { [Op.gt]: 0 } },
        attributes: [[fn('AVG', col('duration')), 'avgDuration']]
      }),
      Call.findOne({
        where: { userId, createdAt: { [Op.gte]: startDate } },
        attributes: [[fn('SUM', col('cost')), 'totalCost']]
      }),
      Call.findAll({
        where: { userId, createdAt: { [Op.gte]: startDate } },
        attributes: ['sentiment', [fn('COUNT', '*'), 'count']],
        group: ['sentiment']
      }),
      this.getCallsOverTime(userId, period),
      this.getTopAgents(userId, period)
    ]);

    return {
      overview: {
        totalCalls,
        totalLeads,
        qualifiedLeads,
        totalAppointments,
        avgCallDuration: Math.round(avgCallDuration?.dataValues?.avgDuration || 0),
        totalCost: parseFloat(totalCost?.dataValues?.totalCost || 0).toFixed(2),
        conversionRate: totalCalls > 0 ? Math.round((qualifiedLeads / totalCalls) * 100) : 0
      },
      callsByStatus: callsByStatus.reduce((acc, curr) => {
        acc[curr.status] = parseInt(curr.dataValues.count);
        return acc;
      }, {}),
      sentimentBreakdown: sentimentBreakdown.reduce((acc, curr) => {
        acc[curr.sentiment || 'unknown'] = parseInt(curr.dataValues.count);
        return acc;
      }, {}),
      callsOverTime,
      topAgents
    };
  }

  /**
   * Get calls over time for charting
   */
  async getCallsOverTime(userId, period) {
    const startDate = this.getPeriodStart(period);
    const groupFormat = period === '24h' ? 'YYYY-MM-DD HH:00:00' : 'YYYY-MM-DD';
    
    const calls = await Call.findAll({
      where: { userId, createdAt: { [Op.gte]: startDate } },
      attributes: [
        [fn('DATE_TRUNC', period === '24h' ? 'hour' : 'day', col('created_at')), 'date'],
        [fn('COUNT', '*'), 'count'],
        [fn('SUM', col('duration')), 'duration']
      ],
      group: [fn('DATE_TRUNC', period === '24h' ? 'hour' : 'day', col('created_at'))],
      order: [[fn('DATE_TRUNC', period === '24h' ? 'hour' : 'day', col('created_at')), 'ASC']],
      raw: true
    });

    return calls.map(c => ({
      date: dayjs(c.date).format(groupFormat),
      calls: parseInt(c.count),
      minutes: Math.round(parseFloat(c.duration || 0) / 60)
    }));
  }

  /**
   * Get top performing agents
   */
  async getTopAgents(userId, period) {
    const startDate = this.getPeriodStart(period);
    
    return await AIAgent.findAll({
      where: { userId },
      include: [{
        model: Call,
        as: 'calls',
        where: { createdAt: { [Op.gte]: startDate } },
        required: false
      }],
      attributes: ['id', 'name', 'type', 'status']
    });
  }

  /**
   * Get lead analytics
   */
  async getLeadAnalytics(userId, period = '30d') {
    const startDate = this.getPeriodStart(period);
    
    const [
      byStatus,
      bySource,
      byScore,
      conversionFunnel
    ] = await Promise.all([
      Lead.findAll({
        where: { userId, createdAt: { [Op.gte]: startDate } },
        attributes: ['status', [fn('COUNT', '*'), 'count']],
        group: ['status']
      }),
      Lead.findAll({
        where: { userId, createdAt: { [Op.gte]: startDate } },
        attributes: ['source', [fn('COUNT', '*'), 'count']],
        group: ['source']
      }),
      Lead.findAll({
        where: { userId, createdAt: { [Op.gte]: startDate } },
        attributes: [
          [literal('CASE WHEN score >= 80 THEN \"high\" WHEN score >= 50 THEN \"medium\" ELSE \"low\" END'), 'category'],
          [fn('COUNT', '*'), 'count']
        ],
        group: [literal('CASE WHEN score >= 80 THEN \"high\" WHEN score >= 50 THEN \"medium\" ELSE \"low\" END')]
      }),
      this.getConversionFunnel(userId, startDate)
    ]);

    return {
      byStatus: byStatus.reduce((acc, curr) => ({ ...acc, [curr.status]: parseInt(curr.dataValues.count) }), {}),
      bySource: bySource.reduce((acc, curr) => ({ ...acc, [curr.source]: parseInt(curr.dataValues.count) }), {}),
      byScore: byScore.reduce((acc, curr) => ({ ...acc, [curr.dataValues.category]: parseInt(curr.dataValues.count) }), {}),
      conversionFunnel
    };
  }

  /**
   * Get conversion funnel data
   */
  async getConversionFunnel(userId, startDate) {
    const statuses = ['new', 'contacted', 'qualified', 'proposal', 'won'];
    const funnel = [];
    
    for (const status of statuses) {
      const count = await Lead.count({
        where: { userId, status, createdAt: { [Op.gte]: startDate } }
      });
      funnel.push({ status, count });
    }
    
    return funnel;
  }

  /**
   * Get real-time metrics
   */
  async getRealTimeMetrics(userId) {
    const lastHour = dayjs().subtract(1, 'hour').toDate();
    const today = dayjs().startOf('day').toDate();
    
    const [
      activeCalls,
      callsToday,
      leadsToday,
      appointmentsToday,
      avgResponseTime
    ] = await Promise.all([
      Call.count({ where: { userId, status: 'in_progress' } }),
      Call.count({ where: { userId, createdAt: { [Op.gte]: today } } }),
      Lead.count({ where: { userId, createdAt: { [Op.gte]: today } } }),
      Appointment.count({ where: { userId, createdAt: { [Op.gte]: today } } }),
      Call.findOne({
        where: { userId, createdAt: { [Op.gte]: lastHour }, status: 'completed' },
        attributes: [[fn('AVG', col('duration')), 'avg']]
      })
    ]);

    return {
      activeCalls,
      callsToday,
      leadsToday,
      appointmentsToday,
      avgResponseTime: Math.round(avgResponseTime?.dataValues?.avg || 0)
    };
  }

  /**
   * Get period start date
   */
  getPeriodStart(period) {
    const now = dayjs();
    switch (period) {
      case '24h': return now.subtract(24, 'hour').toDate();
      case '7d': return now.subtract(7, 'day').toDate();
      case '30d': return now.subtract(30, 'day').toDate();
      case '90d': return now.subtract(90, 'day').toDate();
      default: return now.subtract(7, 'day').toDate();
    }
  }
}

module.exports = new AnalyticsService();
