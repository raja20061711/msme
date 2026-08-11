import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, Eye, Bell, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.getAlerts();
      if (res.success && res.data) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.error('Failed to load security alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.markAlertRead(id);
      setAlerts(alerts.map(a => (a._id === id || a.id === id) ? { ...a, isRead: true } : a));
    } catch (err) {
      console.error('Error marking alert as read:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <h1 className="text-2xl font-extrabold text-white">Security Alerts</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time notifications generated for MEDIUM and HIGH risk digital fraud threats.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-mono">Fetching Security Alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
          <p className="text-sm font-semibold text-emerald-400 mb-1">✓ All clear! No active security threat alerts.</p>
          <p className="text-xs text-slate-500">Run digital scans in Scan Center to test fraud detection capabilities.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert._id || alert.id}
              className={`p-5 rounded-2xl border transition-all ${
                alert.isRead
                  ? 'glass-panel opacity-70 border-slate-800'
                  : 'glass-panel-glow border-rose-500/40 bg-slate-900/90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <RiskBadge level={alert.riskLevel} />
                    <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300">{alert.message}</p>
                  <div className="text-[10px] font-mono text-slate-500">
                    Triggered: {new Date(alert.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to={`/results/${alert.scanId}`}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold text-xs hover:bg-cyan-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Scan</span>
                  </Link>

                  {!alert.isRead && (
                    <button
                      onClick={() => handleMarkRead(alert._id || alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Mark Read</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
