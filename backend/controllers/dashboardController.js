const Scan = require('../models/Scan');
const Alert = require('../models/Alert');
const { getIsFallback, getMemoryStore } = require('../config/db');

const getSummary = async (req, res) => {
  try {
    let scans = [];
    let alerts = [];

    if (getIsFallback()) {
      const store = getMemoryStore();
      scans = store.scans;
      alerts = store.alerts;
    } else {
      scans = await Scan.find({}).sort({ createdAt: -1 });
      alerts = await Alert.find({});
    }

    const totalScans = scans.length;
    const highRiskScans = scans.filter(s => s.riskLevel === 'HIGH').length;
    const mediumRiskScans = scans.filter(s => s.riskLevel === 'MEDIUM').length;
    const safeScans = scans.filter(s => s.riskLevel === 'SAFE').length;
    const threatsDetected = highRiskScans + mediumRiskScans;
    const unreadAlerts = alerts.filter(a => !a.isRead).length;

    // Calculate Business Security Score (0 to 100)
    let securityScore = 100;
    if (totalScans > 0) {
      const avgRisk = scans.reduce((acc, curr) => acc + (curr.riskScore || 0), 0) / totalScans;
      securityScore = Math.round(100 - avgRisk);
      securityScore = Math.max(10, Math.min(100, securityScore));
    }

    // Distribution by scan type
    const scanDistribution = [
      { name: 'Email', value: scans.filter(s => s.type === 'EMAIL').length },
      { name: 'URL', value: scans.filter(s => s.type === 'URL').length },
      { name: 'Invoice', value: scans.filter(s => s.type === 'INVOICE').length },
      { name: 'Payment', value: scans.filter(s => s.type === 'PAYMENT').length },
      { name: 'QR Code', value: scans.filter(s => s.type === 'QR').length }
    ];

    // Risk level distribution
    const threatTypes = [
      { name: 'SAFE', value: safeScans, color: '#10B981' },
      { name: 'MEDIUM', value: mediumRiskScans, color: '#F59E0B' },
      { name: 'HIGH', value: highRiskScans, color: '#EF4444' }
    ];

    // Mock trend over days for Recharts timeline
    const trendData = [
      { date: 'Mon', scans: 4, threats: 1, safe: 3 },
      { date: 'Tue', scans: 6, threats: 2, safe: 4 },
      { date: 'Wed', scans: 8, threats: 3, safe: 5 },
      { date: 'Thu', scans: 5, threats: 1, safe: 4 },
      { date: 'Fri', scans: 9, threats: 4, safe: 5 },
      { date: 'Sat', scans: 7, threats: 2, safe: 5 },
      { date: 'Sun', scans: totalScans, threats: threatsDetected, safe: safeScans }
    ];

    res.json({
      success: true,
      summary: {
        securityScore,
        totalScans,
        threatsDetected,
        highRiskAlerts: highRiskScans,
        unreadAlerts,
        safeScans,
        mediumRiskScans
      },
      charts: {
        scanDistribution,
        threatTypes,
        trendData
      },
      recentScans: scans.slice(0, 5)
    });

  } catch (error) {
    console.error('[Dashboard Summary Error]:', error);
    res.status(500).json({ success: false, message: 'Error generating dashboard metrics.' });
  }
};

module.exports = {
  getSummary
};
