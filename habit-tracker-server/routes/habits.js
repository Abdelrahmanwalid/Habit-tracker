const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const auth = require('../middleware/auth');

router.get('/', auth, habitController.getHabits);
router.post('/', auth, habitController.createHabit);
router.get('/:habitId/logs', auth, habitController.getHabitLogs);
router.post('/:habitId/log', auth, habitController.logHabit);
router.delete('/:habitId', auth, habitController.deleteHabit);
router.post('/set-test-date', auth, habitController.setTestDate);
router.get('/current-date', auth, habitController.getCurrentDate);

module.exports = router;