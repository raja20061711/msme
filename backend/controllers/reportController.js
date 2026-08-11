const Scan = require('../models/Scan');
const { getIsFallback, getMemoryStore } = require('../config/db');

const getReports = async (req, res) => {
  try {
    let scans = [];
    if (getIsFallback()) {
      scans = getMemoryStore().scans;
    } else {
      scans = await Scan.find({}).sort({ createdAt: -1 });
    }

    const reports = scans.map(s => ({
      reportId: `REP-${(s._id || s.id).toString().slice(-6).toUpperCase()}`,
      scanId: s._id || s.id,
      date: s.createdAt,
      scanType: s.type,
      target: s.target,
      riskScore: s.riskScore,
      riskLevel: s.riskLevel,
      indicatorCount: s.indicators?.length || 0,
      downloadUrl: `/api/reports/${s._id || s.id}/download`
    }));

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving security reports.' });
  }
};

const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    let scan = null;

    if (getIsFallback()) {
      scan = getMemoryStore().scans.find(s => s._id === id || s.id === id) || getMemoryStore().scans[0];
    } else {
      scan = await Scan.findById(id);
    }

    if (!scan) {
      return res.status(404).json({ success: false, message: 'Report scan target not found.' });
    }

    res.json({
      success: true,
      data: {
        reportId: `REP-${(scan._id || scan.id).toString().slice(-6).toUpperCase()}`,
        generatedAt: new Date().toISOString(),
        scan
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error rendering report details.' });
  }
};

module.exports = {
  getReports,
  getReportById
};
