const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/dashboard', analyticsController.getDashboard);
router.get('/real-time', analyticsController.getRealTime);
router.get('/leads', analyticsController.getLeadAnalytics);
router.get('/calls/trends', analyticsController.getCallTrends);
router.get('/agents/performance', analyticsController.getAgentPerformance);
router.get('/reports/export', analyticsController.exportReport);

module.exports = router;
