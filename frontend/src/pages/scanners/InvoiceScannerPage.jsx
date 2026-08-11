import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Upload, Sparkles, ArrowRight, FileText } from 'lucide-react';
import { api } from '../../services/api';
import { ScanningProgress } from '../../components/scanners/ScanningProgress';

export const InvoiceScannerPage = () => {
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
        formData.append('filename', 'Demo_Vendor_Invoice.pdf');
        formData.append('ocrText', 'INVOICE DRAFT TAX\nVendor: Unverified Tech Pvt Ltd\nAmount: INR 85,000\nDate: 2026-08-10');
      }

      const res = await api.scanInvoice(formData);
      setIsScanning(false);

      if (res && res.success && res.data) {
        const id = res.data._id || res.data.id;
        navigate(`/results/${id}`);
      } else {
        alert(res?.message || 'Invoice scan failed. Please try again.');
      }
    } catch (err) {
      setIsScanning(false);
      console.error('Invoice scan error:', err);
      alert('Error connecting to backend server.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {isScanning && (
        <ScanningProgress scanType="Invoice Document" />
      )}

      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30">
        <div className="flex items-center gap-2.5 mb-1">
          <FileSpreadsheet className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-extrabold text-white">Invoice OCR & Fraud Scanner</h1>
        </div>
        <p className="text-xs text-slate-400">
          Upload billing invoices (JPG, PNG, PDF). Preprocessed with OpenCV & Tesseract OCR to verify GSTIN syntax and billing metadata.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        {/* Drag and Drop Zone */}
        <label className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-900/60 group">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>

          {previewName ? (
            <div className="text-center">
              <span className="text-xs font-bold text-white flex items-center justify-center gap-1.5 mb-1">
                <FileText className="w-4 h-4 text-purple-400" />
                {previewName}
              </span>
              <span className="text-[11px] text-emerald-400">Ready for OpenCV OCR Extraction</span>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs font-bold text-slate-200 mb-1">
                Click to browse or drop Invoice image / PDF
              </p>
              <p className="text-[11px] text-slate-500">
                Supports JPG, PNG, WEBP, or PDF (Max 10MB)
              </p>
            </div>
          )}

          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Don't have an invoice file ready?</span>
          <button
            type="button"
            onClick={() => {
              setPreviewName('Demo_Suspicious_Invoice_INV2026.pdf');
              setSelectedFile(null);
            }}
            className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use Preset Demo Invoice</span>
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>RUN OPENCV & OCR INVOICE ANALYSIS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
