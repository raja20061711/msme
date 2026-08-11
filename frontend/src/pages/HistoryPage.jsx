import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Eye, Filter, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';

export const HistoryPage = () => {
  const [scans, setScans] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async (filterType = activeFilter) => {
    setLoading(true);
    try {
      const res = await api.getScans(filterType);
      if (res.success && res.data) {
        setScans(res.data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(activeFilter);
  }, [activeFilter]);

  const filterOptions = ['ALL', 'EMAIL', 'URL', 'INVOICE', 'PAYMENT', 'QR'];

  return (
    <div className="space-y-6 pb-12">
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <History className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white">Scan History Archive</h1>
          </div>
          <p className="text-xs text-slate-400">
            Historical digital fraud detection records saved in persistent database.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === f
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-mono">Fetching Scan Archive...</p>
        </div>
      ) : scans.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
          <p className="text-sm font-semibold text-slate-400 mb-2">No scan records found for filter '{activeFilter}'.</p>
          <Link to="/scan" className="text-xs text-cyan-400 font-bold hover:underline">
            Run a new scan in Scan Center →
          </Link>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Scan Type</th>
                  <th className="py-3.5 px-6">Target / Artifact</th>
                  <th className="py-3.5 px-6">Risk Score</th>
                  <th className="py-3.5 px-6">Risk Status</th>
                  <th className="py-3.5 px-6 text-right">View Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {scans.map((scan) => (
                  <tr key={scan._id || scan.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 text-slate-400 whitespace-nowrap">
                      {new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {scan.type}
                    </td>
                    <td className="py-4 px-6 font-medium text-white max-w-xs truncate">
                      {scan.target}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-200 whitespace-nowrap">
                      {scan.riskScore} / 100
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <RiskBadge level={scan.riskLevel} />
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Link
                        to={`/results/${scan._id || scan.id}`}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
