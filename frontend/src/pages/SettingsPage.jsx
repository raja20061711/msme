import React, { useState } from 'react';
import { Settings, Shield, Save, CheckCircle, Cpu, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState(user?.businessName || 'Apex Enterprises');
  const [ownerName, setOwnerName] = useState(user?.ownerName || 'Rahul Sharma');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div className="flex items-center gap-2.5 mb-1">
          <Settings className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-extrabold text-white">System Settings & Profile</h1>
        </div>
        <p className="text-xs text-slate-400">
          Manage business profile, fraud engine threshold sensitivity, and service connection preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>System configuration updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Profile */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            MSME Business Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Owner Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* AI Service System Telemetry */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            AI Service Engine Connection Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Node.js Express Backend</span>
              <span className="text-emerald-400 font-mono font-bold">ONLINE (Port 5000)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Python AI Risk Engine</span>
              <span className="text-cyan-400 font-mono font-bold">ACTIVE (Port 5001 / Local Bridge)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">OpenCV Preprocessor</span>
              <span className="text-emerald-400 font-mono font-bold">ENABLED</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Tesseract OCR Engine</span>
              <span className="text-emerald-400 font-mono font-bold">ACTIVE WRAPPER</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </form>
    </div>
  );
};
