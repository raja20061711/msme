import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Upload, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { ScanningProgress } from '../../components/scanners/ScanningProgress';

export const EmailScannerPage = () => {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResultId, setScanResultId] = useState(null);

  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBody(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!body && !subject) return;

    setIsScanning(true);

    try {
      const res = await api.scanEmail({ sender, subject, body });
      setIsScanning(false);

      if (res && res.success && res.data) {
        const id = res.data._id || res.data.id;
        navigate(`/results/${id}`);
      } else {
        alert(res?.message || 'Email scan failed. Please try again.');
      }
    } catch (err) {
      setIsScanning(false);
      console.error('Email scan error:', err);
      alert('Error connecting to backend server.');
    }
  };

  const fillSamplePhishing = () => {
    setSender('support-security@paypal-verify-alert.com');
    setSubject('URGENT: Your Account Has Been Suspended Within 24 Hours');
    setBody('Dear Valued Customer,\n\nWe detected unauthorized login attempts on your account. Your services will be terminated unless you verify your password immediately.\n\nPlease click here to restore access: http://192.168.1.50/login-verify-account\n\nEnter your account credentials and bank details right away to avoid permanent lockout.\n\nPayPal Security Team');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {isScanning && (
        <ScanningProgress scanType="Email" />
      )}

      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Mail className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white">Email Fraud Scanner</h1>
          </div>
          <p className="text-xs text-slate-400">
            Paste suspicious email headers and body text to detect phishing indicators and sender spoofing.
          </p>
        </div>

        <button
          onClick={fillSamplePhishing}
          className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Sample Phishing Email</span>
        </button>
      </div>

      <form onSubmit={handleAnalyze} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Sender Email Address</label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. support@paypal-verify-alert.com"
              className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. URGENT: Account Suspension Notice"
              className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Body Content</label>
            <label className="cursor-pointer text-[11px] text-cyan-400 font-semibold hover:underline flex items-center gap-1">
              <Upload className="w-3 h-3" />
              <span>Upload .txt File</span>
              <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <textarea
            required
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste raw email content or message text here..."
            className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl p-4 text-xs text-white placeholder-slate-500 outline-none font-sans"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>ANALYZE EMAIL FOR FRAUD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
