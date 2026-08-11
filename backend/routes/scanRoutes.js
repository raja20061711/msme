const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const {
  scanEmail,
  scanUrl,
  scanInvoice,
  scanPayment,
  scanQr,
  getScans,
  getScanById
} = require('../controllers/scanController');

// Multer memory storage for image/file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/email', authMiddleware, scanEmail);
router.post('/url', authMiddleware, scanUrl);
router.post('/invoice', authMiddleware, upload.single('file'), scanInvoice);
router.post('/payment', authMiddleware, upload.single('file'), scanPayment);
router.post('/qr', authMiddleware, upload.single('file'), scanQr);

router.get('/', authMiddleware, getScans);
router.get('/:id', authMiddleware, getScanById);

module.exports = router;
