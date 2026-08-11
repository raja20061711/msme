import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { ScanningProgress } from '../../components/scanners/ScanningProgress';

export const UrlScannerPage = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResultId, setScanResultId] = useState(null);

  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsScanning(true);

    try {
      const res = await api.scanUrl(url.trim());
      setIsScanning(false);

      if (res && res.success && res.data) {
        const id = res.data._id || res.data.id;
        navigate(`/results/${id}`);
      } else {
        alert(res?.message || 'URL scan failed. Please try again.');
      }
    } catch (err) {
      setIsScanning(false);
      console.error('URL scan error:', err);
      alert('Error connecting to backend server.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {isScanning && (
        <ScanningProgress scanType="Website URL" />
      )}

      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div className="flex items-center gap-2.5 mb-1">
          <Globe className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-extrabold text-white">URL Phishing Scanner</h1>
        </div>
        <p className="text-xs text-slate-400">
          Enter a web link to inspect protocol encryption, raw IP hosts, typosquatting, and obfuscated paths.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Website URL</label>
          <input
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. http://192.168.1.50/login-hdfc-verify-account"
            className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-400 items-center">
          <span className="text-[11px] font-semibold text-slate-500">Quick Demo Presets:</span>
          <button
            type="button"
            onClick={() => setUrl('http://192.168.1.100/verify-bank-credentials-urgent')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:border-rose-500/40 text-[11px]"
          >
            IP-Phishing Link
          </button>
          <button
            type="button"
            onClick={() => setUrl('https://secure-paypal-login-update.bit.ly/account')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-500/40 text-[11px]"
          >
            Shortened URL
          </button>
          <button
            type="button"
            onClick={() => setUrl('https://www.hdfcbank.com')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 hover:border-emerald-500/40 text-[11px]"
          >
            Official Bank Link
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>SCAN URL FOR PHISHING</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
