const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

router.use(authenticate);

router.get('/', appointmentController.getAppointments);
router.get('/calendar', appointmentController.getCalendar);
router.get('/upcoming', appointmentController.getUpcoming);
router.post('/', validate(schemas.createAppointment), appointmentController.createAppointment);
router.get('/:id', appointmentController.getAppointment);
router.patch('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
