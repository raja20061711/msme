import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Upload, Sparkles, ArrowRight, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';
import { ScanningProgress } from '../../components/scanners/ScanningProgress';

export const PaymentScannerPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewName, setPreviewName] = useState('');
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
        formData.append('filename', 'gpay_receipt_proof.png');
        formData.append('ocrText', 'PAID SUCCESSFUL\nAmount: INR 12,500\nUPI: vendor@okaxis\nRef UTR: 409812763901');
      }

      const res = await api.scanPayment(formData);
      setIsScanning(false);

      if (res && res.success && res.data) {
        const id = res.data._id || res.data.id;
        navigate(`/results/${id}`);
      } else {
        alert(res?.message || 'Scan processing failed. Please try again.');
      }
    } catch (err) {
      setIsScanning(false);
      console.error('Payment scan error:', err);
      alert('Error connecting to backend server.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {isScanning && (
        <ScanningProgress scanType="Payment Screenshot" />
      )}

      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30">
        <div className="flex items-center gap-2.5 mb-1">
          <CreditCard className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-extrabold text-white">Payment Screenshot Scanner</h1>
        </div>
        <p className="text-xs text-slate-400">
          Analyze UPI, Paytm, GPay or bank transfer screenshot proof for missing 12-digit UTR IDs and text editing artifacts.
        </p>
      </div>

      {/* Mandatory Prototype Disclaimer Notice */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>
          <strong>Prototype Notice:</strong> Screenshot analysis checks image OCR artifacts and reference formatting. It does not perform live central bank ledger verification.
        </span>
      </div>

      <form onSubmit={handleAnalyze} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-900/60 group">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>

          {previewName ? (
            <div className="text-center">
              <span className="text-xs font-bold text-white flex items-center justify-center gap-1.5 mb-1">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                {previewName}
              </span>
              <span className="text-[11px] text-emerald-400">Screenshot image attached for analysis</span>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs font-bold text-slate-200 mb-1">
                Click to browse or drop Payment Screenshot
              </p>
              <p className="text-[11px] text-slate-500">
                Supports JPG, PNG, WEBP (UPI / Bank transfer screenshots)
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

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Test with a sample screenshot preset?</span>
          <button
            type="button"
            onClick={() => {
              setPreviewName('Demo_Fake_Payment_Screenshot.png');
              setSelectedFile(null);
            }}
            className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Preset Screenshot</span>
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>ANALYZE PAYMENT SCREENSHOT</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
