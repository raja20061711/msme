const Scan = require('../models/Scan');
const Alert = require('../models/Alert');
const { getIsFallback, getMemoryStore } = require('../config/db');
const {
  callPythonService,
  analyzeEmailNode,
  analyzeUrlNode,
  analyzeInvoiceNode,
  analyzePaymentNode,
  analyzeQrNode
} = require('../services/aiFallbackService');

// Save scan document and generate alert if HIGH or MEDIUM
async function saveScanResult(userId, scanData) {
  const isFallback = getIsFallback();

  let scanId = 'scan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

  const doc = {
    userId,
    type: scanData.type,
    target: scanData.target,
    extractedData: scanData.extractedData || {},
    indicators: scanData.indicators || [],
    riskScore: scanData.riskScore,
    riskLevel: scanData.riskLevel,
    explanation: scanData.explanation || `${scanData.type} scan completed with ${scanData.indicators?.length || 0} risk indicators detected.`,
    recommendation: scanData.recommendation || 'Review flagged indicators carefully.',
    disclaimer: scanData.disclaimer || 'AI-powered prototype analysis.',
    createdAt: new Date().toISOString()
  };

  if (!isFallback) {
    try {
      const dbScan = await Scan.create({ ...doc, userId });
      scanId = dbScan._id.toString();
    } catch (e) {
      console.warn('[Scan DB Save Warning]:', e.message);
    }
  } else {
    doc._id = scanId;
    const store = getMemoryStore();
    store.scans.unshift(doc);
  }

  // Create alert if MEDIUM or HIGH risk
  if (scanData.riskLevel === 'HIGH' || scanData.riskLevel === 'MEDIUM') {
    const alertDoc = {
      _id: 'alert_' + Date.now(),
      userId,
      scanId,
      title: `${scanData.riskLevel} RISK: ${scanData.type} Fraud Analysis Flagged`,
      message: `${scanData.type} target '${scanData.target}' generated Risk Score ${scanData.riskScore}/100.`,
      riskLevel: scanData.riskLevel,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    if (!isFallback) {
      try {
        await Alert.create(alertDoc);
      } catch (e) {}
    } else {
      const store = getMemoryStore();
      store.alerts.unshift(alertDoc);
    }
  }

  return { ...doc, id: scanId, _id: scanId };
}

// 1. Email Scanner Endpoint
const scanEmail = async (req, res) => {
  try {
    const { sender, subject, body } = req.body;
    const userId = req.user?.id || 'user_demo_1';

    let result = await callPythonService('/analyze/email', { sender, subject, body });
    if (!result) {
      result = analyzeEmailNode(sender, subject, body);
    }

    const savedRecord = await saveScanResult(userId, {
      type: 'EMAIL',
      target: subject || sender || 'Email Analysis Request',
      ...result
    });

    res.status(200).json({ success: true, data: savedRecord });
  } catch (error) {
    console.error('[Scan Email Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze email content.', error: error.message });
  }
};

// 2. URL Scanner Endpoint
const scanUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const userId = req.user?.id || 'user_demo_1';

    if (!url) {
      return res.status(400).json({ success: false, message: 'URL parameter is required.' });
    }

    let result = await callPythonService('/analyze/url', { url });
    if (!result) {
      result = analyzeUrlNode(url);
    }

    const savedRecord = await saveScanResult(userId, {
      type: 'URL',
      target: url,
      ...result
    });

    res.status(200).json({ success: true, data: savedRecord });
  } catch (error) {
    console.error('[Scan URL Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze URL.', error: error.message });
  }
};

// 3. Invoice Scanner Endpoint
const scanInvoice = async (req, res) => {
  try {
    const userId = req.user?.id || 'user_demo_1';
    const filename = req.file ? req.file.originalname : (req.body.filename || 'Uploaded_Invoice.pdf');

    let ocrText = req.body.ocrText || '';
    let result = null;

    if (req.file) {
      // Python microservice multipart attempt
      result = await callPythonService('/analyze/invoice', {}, true, req.file.buffer, req.file.originalname);
    }

    if (!result) {
      // Node fallback analyzer
      result = analyzeInvoiceNode(ocrText, filename);
    }

    const savedRecord = await saveScanResult(userId, {
      type: 'INVOICE',
      target: filename,
      ...result
    });

    res.status(200).json({ success: true, data: savedRecord });
  } catch (error) {
    console.error('[Scan Invoice Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to process invoice.', error: error.message });
  }
};

// 4. Payment Screenshot Scanner Endpoint
const scanPayment = async (req, res) => {
  try {
    const userId = req.user?.id || 'user_demo_1';
    const filename = req.file ? req.file.originalname : (req.body.filename || 'Payment_Screenshot.png');

    let ocrText = req.body.ocrText || '';
    let result = null;

    if (req.file) {
      result = await callPythonService('/analyze/payment', {}, true, req.file.buffer, req.file.originalname);
    }

    if (!result) {
      result = analyzePaymentNode(ocrText, filename);
    }

    const savedRecord = await saveScanResult(userId, {
      type: 'PAYMENT',
      target: filename,
      ...result
    });

    res.status(200).json({ success: true, data: savedRecord });
  } catch (error) {
    console.error('[Scan Payment Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze payment screenshot.', error: error.message });
  }
};

// 5. QR Code Scanner Endpoint
const scanQr = async (req, res) => {
  try {
    const userId = req.user?.id || 'user_demo_1';
    const qrContent = req.body.qrContent || '';
    const filename = req.file ? req.file.originalname : 'QR_Code_Scan.png';

    let result = null;

    if (req.file) {
      result = await callPythonService('/analyze/qr', {}, true, req.file.buffer, req.file.originalname);
    }

    if (!result) {
      result = analyzeQrNode(qrContent || 'https://securemsme-demo-qr-destination.com/verify');
    }

    const savedRecord = await saveScanResult(userId, {
      type: 'QR',
      target: qrContent || filename,
      ...result
    });

    res.status(200).json({ success: true, data: savedRecord });
  } catch (error) {
    console.error('[Scan QR Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze QR code.', error: error.message });
  }
};

// Get All Scans History
const getScans = async (req, res) => {
  try {
    const userId = req.user?.id || 'user_demo_1';
    const { type, riskLevel } = req.query;

    if (getIsFallback()) {
      const store = getMemoryStore();
      let list = [...store.scans];
      if (type && type !== 'ALL') {
        list = list.filter(s => s.type === type.toUpperCase());
      }
      if (riskLevel && riskLevel !== 'ALL') {
        list = list.filter(s => s.riskLevel === riskLevel.toUpperCase());
      }
      return res.json({ success: true, count: list.length, data: list });
    }

    let filter = {};
    if (type && type !== 'ALL') filter.type = type.toUpperCase();
    if (riskLevel && riskLevel !== 'ALL') filter.riskLevel = riskLevel.toUpperCase();

    const scans = await Scan.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: scans.length, data: scans });
  } catch (error) {
    console.error('[Get Scans Error]:', error);
    res.status(500).json({ success: false, message: 'Error retrieving scan history.' });
  }
};

// Get Single Scan Result by ID
const getScanById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsFallback()) {
      const store = getMemoryStore();
      const scan = store.scans.find(s => s._id === id || s.id === id);
      if (!scan) {
        // Return first demo scan if ID mismatch in fallback mode
        return res.json({ success: true, data: store.scans[0] });
      }
      return res.json({ success: true, data: scan });
    }

    const scan = await Scan.findById(id);
    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan result record not found.' });
    }
    res.json({ success: true, data: scan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving scan result details.' });
  }
};

module.exports = {
  scanEmail,
  scanUrl,
  scanInvoice,
  scanPayment,
  scanQr,
  getScans,
  getScanById
};
