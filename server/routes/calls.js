const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Public Twilio webhooks (no auth)
router.post('/webhook/voice', callController.handleIncomingCall);
router.post('/webhook/process-speech', callController.handleSpeech);
router.post('/webhook/status', callController.handleCallStatus);

// Protected routes
router.use(authenticate);

router.get('/', callController.getCalls);
router.get('/analytics', callController.getCallAnalytics);
router.get('/:id', callController.getCall);
router.patch('/:id', validate(schemas.updateCall), callController.updateCall);
router.post('/outbound', callController.initiateOutboundCall);
router.get('/:id/transcript', callController.getTranscript);

module.exports = router;

