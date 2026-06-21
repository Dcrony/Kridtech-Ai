const analyticsService = require('../services/analyticsService');

exports.getDashboard = async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;
    const metrics = await analyticsService.getDashboardMetrics(req.user.id, period);

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
};

exports.getRealTime = async (req, res, next) => {
  try {
    const metrics = await analyticsService.getRealTimeMetrics(req.user.id);

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
};

exports.getLeadAnalytics = async (req, res, next) => {
  try {
    const { period = '30d' } = req.query;
    const analytics = await analyticsService.getLeadAnalytics(req.user.id, period);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

exports.getCallTrends = async (req, res, next) => {
  try {
    const { period = '30d' } = req.query;
    const trends = await analyticsService.getCallsOverTime(req.user.id, period);

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    next(error);
  }
};

exports.getAgentPerformance = async (req, res, next) => {
  try {
    const { period = '30d' } = req.query;
    const performance = await analyticsService.getTopAgents(req.user.id, period);

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    next(error);
  }
};

exports.exportReport = async (req, res, next) => {
  try {
    const { type = 'calls', format = 'csv', startDate, endDate } = req.query;

    // Placeholder for report generation
    res.json({
      success: true,
      message: 'Report generation initiated',
      data: {
        type,
        format,
        startDate,
        endDate,
        downloadUrl: `/api/analytics/reports/${type}_${Date.now()}.${format}`
      }
    });
  } catch (error) {
    next(error);
  }
};