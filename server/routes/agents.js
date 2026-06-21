const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.use(authenticate);

router.post('/', validate(schemas.createAgent), agentController.createAgent);
router.get('/', agentController.getAgents);
router.get('/:id', agentController.getAgent);
router.patch('/:id', validate(schemas.updateAgent), agentController.updateAgent);
router.delete('/:id', agentController.deleteAgent);
router.get('/:id/stats', agentController.getAgentStats);
router.post('/:agentId/clone-voice', agentController.cloneVoice);

module.exports = router;
