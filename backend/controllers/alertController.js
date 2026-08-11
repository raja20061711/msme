const Alert = require('../models/Alert');
const { getIsFallback, getMemoryStore } = require('../config/db');

const getAlerts = async (req, res) => {
  try {
    if (getIsFallback()) {
      const store = getMemoryStore();
      return res.json({ success: true, count: store.alerts.length, data: store.alerts });
    }
    const alerts = await Alert.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving security alerts.' });
  }
};

const markAlertAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsFallback()) {
      const store = getMemoryStore();
      const alert = store.alerts.find(a => a._id === id);
      if (alert) alert.isRead = true;
      return res.json({ success: true, message: 'Alert marked as read.' });
    }

    await Alert.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true, message: 'Alert marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating alert status.' });
  }
};

module.exports = {
  getAlerts,
  markAlertAsRead
};
