import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Upload, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';
import { ScanningProgress } from '../../components/scanners/ScanningProgress';

export const QrScannerPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewName, setPreviewName] = useState('');
  const [manualText, setManualText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResultId, setScanResultId] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewName(file.name);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsScanning(true);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('qrContent', manualText || 'http://192.168.1.100/verify-account-credentials');
      }

      const res = await api.scanQr(formData);
      setIsScanning(false);

      if (res && res.success && res.data) {
        const id = res.data._id || res.data.id;
        navigate(`/results/${id}`);
      } else {
        alert(res?.message || 'QR code scan failed. Please try again.');
      }
    } catch (err) {
      setIsScanning(false);
      console.error('QR scan error:', err);
      alert('Error connecting to backend server.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {isScanning && (
        <ScanningProgress scanType="QR Code Matrix" />
      )}

      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30">
        <div className="flex items-center gap-2.5 mb-1">
          <QrCode className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-extrabold text-white">QR Code Security Scanner</h1>
        </div>
        <p className="text-xs text-slate-400">
          Decode 2D QR codes safely. Decodes matrix payload to reveal destination web links or UPI payment handles without auto-executing them.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-900/60 group">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>

          {previewName ? (
            <div className="text-center">
              <span className="text-xs font-bold text-white flex items-center justify-center gap-1.5 mb-1">
                <QrCode className="w-4 h-4 text-amber-400" />
                {previewName}
              </span>
              <span className="text-[11px] text-amber-400">QR image file attached for decoding</span>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs font-bold text-slate-200 mb-1">
                Click to browse or drop QR Code Image
              </p>
              <p className="text-[11px] text-slate-500">
                Supports JPG, PNG, WEBP (QR matrix image)
              </p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Or Paste Scanned QR Raw String Payload</label>
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="e.g. upi://pay?pa=scammer@ybl&pn=FakeVendor&am=5000"
            className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-mono"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>DECODE & SCAN QR CODE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
