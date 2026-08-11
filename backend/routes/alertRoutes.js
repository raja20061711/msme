const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAlerts, markAlertAsRead } = require('../controllers/alertController');

router.get('/', authMiddleware, getAlerts);
router.patch('/:id/read', authMiddleware, markAlertAsRead);

module.exports = router;
