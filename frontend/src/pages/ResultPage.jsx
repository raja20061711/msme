import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowLeft,
  Download,
  RotateCcw,
  AlertTriangle,
  FileText,
  Info,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { RiskMeter } from '../components/common/RiskMeter';
import { RiskBadge } from '../components/common/RiskBadge';

export const ResultPage = () => {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScanResult = async () => {
      setLoading(true);
      try {
        const res = await api.getScanById(id);
        if (res.success && res.data) {
          setScan(res.data);
        }
      } catch (err) {
        console.error('Failed to load scan result:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScanResult();
  }, [id]);

  const handleDownloadReport = () => {
    window.print();
  };

  if (loading || !scan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-mono">Retrieving AI Security Analysis...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scan History</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 font-bold text-xs transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
          <Link
            to="/scan"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Scan Again</span>
          </Link>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 space-y-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8 text-center sm:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI SECURITY ANALYSIS REPORT</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {scan.type} Fraud Detection Analysis
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Target: <span className="text-slate-200">{scan.target}</span> • ID: {scan._id || scan.id}
            </p>
          </div>

          <RiskMeter score={scan.riskScore} riskLevel={scan.riskLevel} size={150} />
        </div>

        {/* Risk Summary Badge & Explanation */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Risk Assessment Summary</span>
            <RiskBadge level={scan.riskLevel} size="large" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {scan.explanation}
          </p>
        </div>

        {/* Explainable AI Score Breakdown (XAI) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Detected Risk Indicators & Score Weights
            </h3>
            <span className="text-[11px] text-cyan-400 font-mono">Deterministic Feature Weights</span>
          </div>

          {scan.indicators && scan.indicators.length > 0 ? (
            <div className="space-y-3">
              {scan.indicators.map((ind, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{ind.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        ind.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {ind.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{ind.reason}</p>
                  </div>
                  <div className="text-right sm:text-right shrink-0">
                    <span className="text-sm font-mono font-bold text-rose-400">
                      +{ind.scoreContribution} Score
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>No major suspicious indicators flagged during analysis. Feature weights sum to 0.</span>
            </div>
          )}
        </div>

        {/* AI Actionable Recommendation */}
        <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Info className="w-4 h-4" />
            AI Recommended Business Action
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-semibold">
            {scan.recommendation}
          </p>
        </div>

        {/* Extracted Artifact Metadata View */}
        {scan.extractedData && Object.keys(scan.extractedData).length > 0 && (
          <div className="space-y-3 border-t border-slate-800 pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Extracted Telemetry Information</h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre>{JSON.stringify(scan.extractedData, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* Required Disclaimer */}
        <div className="text-[11px] text-slate-500 text-center italic pt-4 border-t border-slate-800/60">
          "{scan.disclaimer || 'AI-powered prototype analysis. Does not perform real bank transaction verification or official GST database lookups.'}"
        </div>
      </div>
    </div>
  );
};
