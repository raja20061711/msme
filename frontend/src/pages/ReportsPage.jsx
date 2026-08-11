import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Eye, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await api.getReports();
        if (res.success && res.data) {
          setReports(res.data);
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownloadPDF = (scanId) => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div className="flex items-center gap-2.5 mb-1">
          <FileText className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-extrabold text-white">Security Executive Reports</h1>
        </div>
        <p className="text-xs text-slate-400">
          Generated audit reports for digital fraud scans, downloadable as structured PDF documentation.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-mono">Compiling Executive Reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
          <p className="text-sm font-semibold text-slate-400 mb-2">No security reports available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => (
            <div
              key={rep.reportId}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-mono text-xs font-bold text-cyan-400">{rep.reportId}</span>
                  <RiskBadge level={rep.riskLevel} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-white">{rep.scanType} Security Audit</h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">Target: {rep.target}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Risk Score</span>
                    <span className="font-mono font-bold text-white">{rep.riskScore} / 100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Flagged Indicators</span>
                    <span className="font-mono font-bold text-white">{rep.indicatorCount} Detected</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  Generated: {new Date(rep.date).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <Link
                  to={`/results/${rep.scanId}`}
                  className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-cyan-400 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </Link>
                <button
                  onClick={() => handleDownloadPDF(rep.scanId)}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
