const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getReports, getReportById } = require('../controllers/reportController');

router.get('/', authMiddleware, getReports);
router.get('/:id', authMiddleware, getReportById);

module.exports = router;
