const API_BASE = '/api';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('securemsme_token') || 'demo_token_securemsme';
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Scanners
  scanEmail: async (data) => {
    const res = await fetch(`${API_BASE}/scans/email`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  scanUrl: async (url) => {
    const res = await fetch(`${API_BASE}/scans/url`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ url })
    });
    return res.json();
  },

  scanInvoice: async (formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await fetch(`${API_BASE}/scans/invoice`, {
      method: 'POST',
      headers: getHeaders(isMultipart),
      body: isMultipart ? formData : JSON.stringify(formData)
    });
    return res.json();
  },

  scanPayment: async (formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await fetch(`${API_BASE}/scans/payment`, {
      method: 'POST',
      headers: getHeaders(isMultipart),
      body: isMultipart ? formData : JSON.stringify(formData)
    });
    return res.json();
  },

  scanQr: async (formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await fetch(`${API_BASE}/scans/qr`, {
      method: 'POST',
      headers: getHeaders(isMultipart),
      body: isMultipart ? formData : JSON.stringify(formData)
    });
    return res.json();
  },

  // History & Result
  getScans: async (type = 'ALL', riskLevel = 'ALL') => {
    const res = await fetch(`${API_BASE}/scans?type=${type}&riskLevel=${riskLevel}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  getScanById: async (id) => {
    const res = await fetch(`${API_BASE}/scans/${id}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Dashboard
  getDashboardSummary: async () => {
    const res = await fetch(`${API_BASE}/dashboard/summary`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Alerts
  getAlerts: async () => {
    const res = await fetch(`${API_BASE}/alerts`, {
      headers: getHeaders()
    });
    return res.json();
  },

  markAlertRead: async (id) => {
    const res = await fetch(`${API_BASE}/alerts/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return res.json();
  },

  // Reports
  getReports: async () => {
    const res = await fetch(`${API_BASE}/reports`, {
      headers: getHeaders()
    });
    return res.json();
  },

  getReportById: async (id) => {
    const res = await fetch(`${API_BASE}/reports/${id}`, {
      headers: getHeaders()
    });
    return res.json();
  }
};
