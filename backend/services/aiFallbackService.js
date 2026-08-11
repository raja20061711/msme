/**
 * SECUREMSME AI - Node.js Integrated Deterministic AI & OCR Fallback Service
 * 
 * Provides HTTP client integration to Python Flask service (http://localhost:5001).
 * If Python microservice is starting or unreachable, transparently executes
 * deterministic feature scoring locally.
 */

const http = require('http');

async function callPythonService(endpoint, bodyData, isMultipart = false, fileBuffer = null, fileName = '') {
  const pythonUrl = process.env.PYTHON_AI_SERVICE_URL || 'http://127.0.0.1:5005';
  const targetUrl = `${pythonUrl}${endpoint}`;

  try {
    if (isMultipart && fileBuffer) {
      const formData = new FormData();
      const ext = (fileName || '').toLowerCase();
      const mimeType = ext.endsWith('.png') ? 'image/png' : (ext.endsWith('.webp') ? 'image/webp' : 'image/jpeg');
      const fileBlob = new Blob([fileBuffer], { type: mimeType });
      formData.append('file', fileBlob, fileName || 'upload.jpeg');

      const response = await fetch(targetUrl, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) return json.data;
      } else {
        console.warn(`[Node AI Bridge] Python service returned HTTP ${response.status} for ${endpoint}`);
      }
    } else {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) return json.data;
      }
    }
  } catch (err) {
    console.warn(`[Node AI Bridge] Python service offline on ${targetUrl} (${err.message}). Using Node AI fallback engine.`);
  }
  return null;
}

// Node-side deterministic risk calculations
function calculateNodeRisk(featureFlags, contextType = 'general') {
  let score = 0;
  const detected = [];

  for (const item of featureFlags) {
    if (item.active) {
      const weight = item.weight || 0;
      score += weight;
      detected.push({
        key: item.key,
        name: item.name,
        severity: item.severity || 'MEDIUM',
        reason: item.reason,
        scoreContribution: weight
      });
    }
  }

  const riskScore = Math.min(100, Math.max(0, score));
  let riskLevel = 'SAFE';
  if (riskScore > 70) riskLevel = 'HIGH';
  else if (riskScore > 30) riskLevel = 'MEDIUM';

  let recommendation = '';
  if (riskLevel === 'HIGH') {
    if (contextType === 'email') recommendation = 'CRITICAL: Do NOT click links or download attachments. Verify sender directly via official phone call.';
    else if (contextType === 'url') recommendation = 'DANGER: High probability of phishing site. Do not input credentials or banking details.';
    else if (contextType === 'invoice') recommendation = 'WARNING: Multiple invoice fraud indicators detected. Hold payment release until manually confirmed.';
    else if (contextType === 'payment') recommendation = 'ALERT: Payment proof missing key transaction reference. Verify bank receipt before dispatching goods.';
    else recommendation = 'HIGH RISK: Exercise maximum caution. Verify all details independently.';
  } else if (riskLevel === 'MEDIUM') {
    recommendation = 'CAUTION: Moderate risk indicators detected. Review flagged items carefully before proceeding.';
  } else {
    recommendation = 'SAFE: No major suspicious indicators were detected in this analysis.';
  }

  return {
    riskScore,
    riskLevel,
    indicators: detected,
    recommendation,
    disclaimer: 'AI-powered prototype analysis. Does not perform real bank transaction verification or official GST database lookups.'
  };
}

// Node-side Analyzers
function analyzeEmailNode(sender = '', subject = '', body = '') {
  const full = `${subject} ${body}`.toLowerCase();
  const s = sender.toLowerCase();

  const urgencyWords = ['urgent', 'immediately', 'suspended', 'blocked', 'verify now', 'action required', '24 hours', 'account locked'];
  const credWords = ['password', 'otp', 'credentials', 'bank details', 'credit card', 'update payment', 'pin'];
  const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'rb.gy'];

  const foundUrgency = urgencyWords.filter(w => full.includes(w));
  const foundCreds = credWords.filter(w => full.includes(w));
  const hasShortener = shorteners.some(sh => full.includes(sh));
  const hasIpLink = /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(full);
  const isFreeMail = (s.includes('@gmail.com') || s.includes('@yahoo.com')) && (full.includes('bank') || full.includes('invoice') || full.includes('paypal'));

  const featureFlags = [
    { key: 'urgency', name: 'Urgency & Threat Language', active: foundUrgency.length > 0, weight: 15, severity: 'MEDIUM', reason: `Uses urgent keywords: ${foundUrgency.join(', ')}` },
    { key: 'credentials', name: 'Sensitive Credential Request', active: foundCreds.length > 0, weight: 25, severity: 'HIGH', reason: `Requests credentials: ${foundCreds.join(', ')}` },
    { key: 'suspicious_link', name: 'Suspicious Link Pattern', active: hasShortener || hasIpLink, weight: 25, severity: 'HIGH', reason: hasShortener ? 'Contains shortened link hiding real URL' : 'Contains raw IP address link' },
    { key: 'sender_mismatch', name: 'Sender Webmail Mismatch', active: isFreeMail, weight: 20, severity: 'HIGH', reason: 'Official financial notice sent from free webmail address' },
    { key: 'payment_req', name: 'Direct Payment Demand', active: full.includes('wire transfer') || full.includes('send money') || full.includes('upi id'), weight: 15, severity: 'MEDIUM', reason: 'Email requests direct money transfer' }
  ];

  const result = calculateNodeRisk(featureFlags, 'email');
  result.extractedData = { sender, subject, urgencyWordsDetected: foundUrgency, urlsFound: full.match(/https?:\/\/[^\s<>"]+/g) || [] };
  return result;
}

function analyzeUrlNode(urlString = '') {
  const url = urlString.trim().toLowerCase();
  const isIp = /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url);
  const noHttps = !url.startsWith('https://');
  const susKeywords = ['login', 'verify', 'secure', 'bank', 'account', 'update', 'signin', 'free', 'gift', 'payout'].filter(k => url.includes(k));
  const isLong = url.length > 65;
  const isShortened = ['bit.ly', 'tinyurl.com', 't.co', 'rb.gy'].some(s => url.includes(s));
  const excessiveSub = (url.split('.').length - 1) > 3;

  const featureFlags = [
    { key: 'ip_host', name: 'Raw IP Host', active: isIp, weight: 25, severity: 'HIGH', reason: 'URL uses numerical IP host instead of domain' },
    { key: 'no_https', name: 'Missing HTTPS Encryption', active: noHttps, weight: 15, severity: 'MEDIUM', reason: 'HTTP connection is unencrypted' },
    { key: 'sus_keywords', name: 'Phishing Target Keywords', active: susKeywords.length > 0, weight: 20, severity: 'HIGH', reason: `Contains sensitive keywords: ${susKeywords.join(', ')}` },
    { key: 'excessive_sub', name: 'Excessive Subdomains', active: excessiveSub, weight: 15, severity: 'MEDIUM', reason: 'Domain contains multiple subdomains' },
    { key: 'long_url', name: 'Abnormally Long URL', active: isLong, weight: 10, severity: 'LOW', reason: `URL length is ${url.length} characters` },
    { key: 'shortened', name: 'Shortened URL Service', active: isShortened, weight: 15, severity: 'MEDIUM', reason: 'Uses link shortener service' }
  ];

  const result = calculateNodeRisk(featureFlags, 'url');
  result.extractedData = { url: urlString, detectedKeywords: susKeywords, hasHttps: !noHttps };
  return result;
}

function analyzeInvoiceNode(ocrText = '', filename = 'invoice.pdf') {
  const text = (ocrText || '').toUpperCase();
  const invMatch = text.match(/(?:INVOICE|INV)\s*#?\s*[:.-]?\s*([A-Z0-9/-]{3,20})/i);
  const gstinMatch = text.match(/\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/);
  const amtMatch = text.match(/(?:TOTAL|AMOUNT|GRAND TOTAL)\s*[:.-]?\s*₹?\s*([\d,]+\.?\d{0,2})/i);

  const missingInv = !invMatch;
  const missingGstin = !gstinMatch;
  const missingAmt = !amtMatch;
  const isDraft = text.includes('SAMPLE') || text.includes('DRAFT') || text.includes('DUPLICATE TAX');

  const featureFlags = [
    { key: 'missing_inv', name: 'Missing Invoice Number', active: missingInv, weight: 20, severity: 'HIGH', reason: 'No standard Invoice # identifier found' },
    { key: 'missing_gstin', name: 'Missing / Invalid GSTIN Format', active: missingGstin, weight: 25, severity: 'HIGH', reason: 'No valid 15-character GSTIN structure detected' },
    { key: 'missing_amt', name: 'Unclear Billing Amount', active: missingAmt, weight: 15, severity: 'MEDIUM', reason: 'Total amount could not be parsed' },
    { key: 'sample_draft', name: 'Sample / Draft Invoice Marker', active: isDraft, weight: 20, severity: 'HIGH', reason: 'Document marked as sample or draft' }
  ];

  const result = calculateNodeRisk(featureFlags, 'invoice');
  result.extractedData = {
    invoiceNumber: invMatch ? invMatch[1] : 'NOT DETECTED',
    gstin: gstinMatch ? gstinMatch[0] : 'INVALID / MISSING',
    amount: amtMatch ? `₹${amtMatch[1]}` : 'UNSPECIFIED',
    filename
  };
  return result;
}

function analyzePaymentNode(ocrText = '', filename = 'payment.png') {
  const text = (ocrText || '').toUpperCase();
  const txnMatch = text.match(/(?:TXN|UTR|REF|TRANSACTION)\s*[:.-]?\s*([A-Z0-9]{8,22})/i) || text.match(/\b\d{12}\b/);
  const upiMatch = text.match(/\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b/);
  const isSuccess = text.includes('SUCCESS') || text.includes('PAID') || text.includes('COMPLETED') || text.includes('TRANSFERRED');

  const missingTxn = !txnMatch;
  const missingUpi = !upiMatch;

  const featureFlags = [
    { key: 'missing_txn', name: 'Missing Transaction ID / UTR', active: missingTxn, weight: 30, severity: 'HIGH', reason: 'Lacks 12-digit UTR or transaction ID proof' },
    { key: 'missing_upi', name: 'Missing UPI VPA Handle', active: missingUpi, weight: 20, severity: 'MEDIUM', reason: 'No valid UPI handle (e.g. name@okaxis) found' },
    { key: 'unconfirmed_status', name: 'Unconfirmed Payment Status', active: !isSuccess, weight: 25, severity: 'HIGH', reason: 'Screenshot does not explicitly show SUCCESSFUL status' }
  ];

  const result = calculateNodeRisk(featureFlags, 'payment');
  result.extractedData = {
    transactionId: txnMatch ? (typeof txnMatch === 'string' ? txnMatch : txnMatch[1] || txnMatch[0]) : 'NOT DETECTED',
    upiId: upiMatch ? upiMatch[0] : 'NOT DETECTED',
    paymentStatus: isSuccess ? 'SUCCESSFUL' : 'UNVERIFIED',
    filename
  };
  return result;
}

function analyzeQrNode(qrContent = '') {
  const content = qrContent.trim();
  if (content.startsWith('http://') || content.startsWith('https://') || content.includes('.com') || content.includes('.in')) {
    const urlRes = analyzeUrlNode(content);
    urlRes.extractedData.qrContent = content;
    urlRes.extractedData.destinationType = 'WEBSITE URL';
    return urlRes;
  }
  return {
    riskScore: 20,
    riskLevel: 'SAFE',
    indicators: [],
    recommendation: 'SAFE: QR contains standard plain text payload.',
    extractedData: { qrContent: content, destinationType: 'PLAIN TEXT' }
  };
}

module.exports = {
  callPythonService,
  analyzeEmailNode,
  analyzeUrlNode,
  analyzeInvoiceNode,
  analyzePaymentNode,
  analyzeQrNode
};
