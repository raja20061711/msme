const mongoose = require('mongoose');

let isInMemoryFallback = false;
let memoryStore = {
  users: [],
  scans: [],
  alerts: [],
  reports: []
};

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/securemsme_db';
    // Set low selection timeout so fallback activates quickly if MongoDB is down
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    isInMemoryFallback = false;
  } catch (error) {
    console.warn(`[Database] Local MongoDB unavailable (${error.message}).`);
    console.log(`[Database] Activating Resilient In-Memory & File Persistence Store.`);
    isInMemoryFallback = true;
    seedFallbackData();
  }
};

function seedFallbackData() {
  if (memoryStore.scans.length === 0) {
    const demoScans = [
      {
        _id: "scan_demo_1",
        userId: "user_demo_1",
        type: "EMAIL",
        target: "Urgent Payment Update Required - PayPal",
        riskScore: 87,
        riskLevel: "HIGH",
        indicators: [
          { key: "urgency", name: "Urgency Language", severity: "MEDIUM", reason: "Email uses high urgency keywords ('within 24 hours', 'immediate action')", scoreContribution: 15 },
          { key: "suspicious_url", name: "Suspicious URL", severity: "HIGH", reason: "Embedded link domain does not match PayPal official host", scoreContribution: 25 },
          { key: "sender_spoof", name: "Sender Domain Mismatch", severity: "HIGH", reason: "Sender uses free Gmail webmail instead of official paypal.com domain", scoreContribution: 20 },
          { key: "credential_req", name: "Sensitive Credential Request", severity: "HIGH", reason: "Email requests account password verification", scoreContribution: 27 }
        ],
        explanation: "Email displays 4 major phishing indicators including domain spoofing and urgent password requests.",
        recommendation: "CRITICAL: Do NOT click any links. Verify sender directly via official phone channel.",
        extractedData: { sender: "support-paypal@gmail.com", subject: "Urgent Account Suspension Notice" },
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        _id: "scan_demo_2",
        userId: "user_demo_1",
        type: "INVOICE",
        target: "INV-2026-9871.pdf",
        riskScore: 76,
        riskLevel: "HIGH",
        indicators: [
          { key: "missing_inv", name: "Missing Invoice Number", severity: "HIGH", reason: "Standard Invoice # missing from header", scoreContribution: 20 },
          { key: "invalid_gstin", name: "Invalid GSTIN Format", severity: "HIGH", reason: "No 15-character GSTIN structure detected in document", scoreContribution: 25 },
          { key: "unknown_vendor", name: "Unverified Vendor Name", severity: "MEDIUM", reason: "Vendor header mismatch", scoreContribution: 31 }
        ],
        explanation: "Invoice contains unverified GSTIN format and missing standard billing identifiers.",
        recommendation: "WARNING: Cross-check vendor credentials and hold payment release.",
        extractedData: { vendorName: "Tech Solutions Pvt Ltd", amount: "₹1,45,000", gstin: "INVALID" },
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        _id: "scan_demo_3",
        userId: "user_demo_1",
        type: "URL",
        target: "https://secure-hdfc-banking-update.net/login",
        riskScore: 92,
        riskLevel: "HIGH",
        indicators: [
          { key: "keywords", name: "Phishing Target Keywords", severity: "HIGH", reason: "Domain contains 'hdfc' and 'login' spoofing bank portal", scoreContribution: 30 },
          { key: "excessive_sub", name: "Excessive Subdomains", severity: "MEDIUM", reason: "Non-standard top level domain .net", scoreContribution: 20 },
          { key: "ip_mask", name: "Typosquatting Pattern", severity: "HIGH", reason: "Unregistered third-party domain hosting fake portal", scoreContribution: 42 }
        ],
        explanation: "URL is a clear typosquatting phishing attempt targeting HDFC bank account credentials.",
        recommendation: "DANGER: High probability of phishing site. Do not input credentials.",
        extractedData: { url: "https://secure-hdfc-banking-update.net/login", hostname: "secure-hdfc-banking-update.net" },
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        _id: "scan_demo_4",
        userId: "user_demo_1",
        type: "PAYMENT",
        target: "upi_receipt_screenshot.png",
        riskScore: 24,
        riskLevel: "SAFE",
        indicators: [],
        explanation: "Payment screenshot contains valid UTR 12-digit transaction ID and clear SUCCESSFUL status.",
        recommendation: "SAFE: No major suspicious indicators detected in this screenshot analysis.",
        extractedData: { transactionId: "409812763901", amount: "₹4,500", upiId: "vendor@okaxis", paymentStatus: "SUCCESSFUL" },
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        _id: "scan_demo_5",
        userId: "user_demo_1",
        type: "QR",
        target: "invoice_qr_code.png",
        riskScore: 91,
        riskLevel: "HIGH",
        indicators: [
          { key: "qr_url_phish", name: "Malicious QR Destination", severity: "HIGH", reason: "QR payload redirects to suspicious credential harvesting link", scoreContribution: 91 }
        ],
        explanation: "QR Code redirects to an unverified external login form.",
        recommendation: "HIGH RISK: Do not open destination or enter payment details.",
        extractedData: { qrContent: "http://192.168.1.100/verify-account", destinationType: "WEBSITE URL" },
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
      }
    ];

    memoryStore.scans = demoScans;

    memoryStore.alerts = [
      {
        _id: "alert_1",
        userId: "user_demo_1",
        scanId: "scan_demo_3",
        title: "DANGER: High Risk URL Phishing Attempt Flagged",
        message: "URL https://secure-hdfc-banking-update.net/login was flagged with Risk Score 92/100.",
        riskLevel: "HIGH",
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        _id: "alert_2",
        userId: "user_demo_1",
        scanId: "scan_demo_1",
        title: "HIGH RISK: Phishing Email Detected",
        message: "Email 'Urgent Account Suspension Notice' flagged with Risk Score 87/100.",
        riskLevel: "HIGH",
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        _id: "alert_3",
        userId: "user_demo_1",
        scanId: "scan_demo_2",
        title: "MEDIUM RISK: Invoice GSTIN Anomaly Flagged",
        message: "Invoice INV-2026-9871 flagged with Risk Score 76/100 due to unverified GSTIN.",
        riskLevel: "MEDIUM",
        isRead: true,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ];
  }
}

const getMemoryStore = () => memoryStore;
const getIsFallback = () => isInMemoryFallback;

module.exports = {
  connectDB,
  getMemoryStore,
  getIsFallback
};
