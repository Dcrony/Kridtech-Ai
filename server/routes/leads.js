const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.use(authenticate);

router.get('/', leadController.getLeads);
router.get('/stats', leadController.getLeadStats);
router.post('/', leadController.createLead);
router.get('/:id', leadController.getLead);
router.patch('/:id', validate(schemas.updateLead), leadController.updateLead);
router.delete('/:id', leadController.deleteLead);
router.post('/bulk-update', leadController.bulkUpdate);

module.exports = router;
