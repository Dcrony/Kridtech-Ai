const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/agents', require('./agents'));
router.use('/calls', require('./calls'));
router.use('/appointments', require('./appointments'));
router.use('/leads', require('./leads'));
router.use('/analytics', require('./analytics'));
router.use('/notifications', require('./notifications'));

module.exports = router;