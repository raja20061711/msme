import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, FileSpreadsheet, CreditCard, QrCode, ArrowRight, Shield } from 'lucide-react';

export const ScanCenterPage = () => {
  const scanners = [
    {
      id: 'email',
      title: 'EMAIL SCANNER',
      desc: 'Check suspicious emails for phishing attempts, urgency language, credential harvesting, and domain spoofing.',
      icon: Mail,
      link: '/scan/email',
      color: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-cyan-500/30',
      badge: 'Phishing Detection'
    },
    {
      id: 'url',
      title: 'URL SCANNER',
      desc: 'Inspect website domain links for IP address masking, missing HTTPS certificates, and typosquatting keywords.',
      icon: Globe,
      link: '/scan/url',
      color: 'from-blue-500/20 to-indigo-500/10',
      borderColor: 'border-blue-500/30',
      badge: 'Domain Verification'
    },
    {
      id: 'invoice',
      title: 'INVOICE SCANNER',
      desc: 'Upload invoice PDF or image. Uses OpenCV preprocessing & Tesseract OCR to extract fields and flag GSTIN syntax errors.',
      icon: FileSpreadsheet,
      link: '/scan/invoice',
      color: 'from-purple-500/20 to-violet-500/10',
      borderColor: 'border-purple-500/30',
      badge: 'OCR & Billing Check'
    },
    {
      id: 'payment',
      title: 'PAYMENT SCREENSHOT SCANNER',
      desc: 'Analyze payment screenshots (GPay, PhonePe, UPI). Extracts UTR reference IDs and flags altered text artifacts.',
      icon: CreditCard,
      link: '/scan/payment',
      color: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/30',
      badge: 'Payment Proof Verification'
    },
    {
      id: 'qr',
      title: 'QR CODE SCANNER',
      desc: 'Decode QR code matrix payloads to reveal hidden destination URLs or UPI addresses before scanning.',
      icon: QrCode,
      link: '/scan/qr',
      color: 'from-amber-500/20 to-yellow-500/10',
      borderColor: 'border-amber-500/30',
      badge: 'Destination Inspection'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-extrabold text-white">What would you like to check?</h1>
        </div>
        <p className="text-xs text-slate-400">
          Select an AI fraud detection vector below to analyze digital artifacts for your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scanners.map((sc) => {
          const Icon = sc.icon;
          return (
            <div
              key={sc.id}
              className={`glass-panel p-6 rounded-2xl border ${sc.borderColor} flex flex-col justify-between hover:scale-[1.02] transition-all group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sc.color} flex items-center justify-center text-cyan-400 border border-slate-700 group-hover:border-cyan-400 transition-colors`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                    {sc.badge}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white mb-2 tracking-tight group-hover:text-cyan-300 transition-colors">
                  {sc.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {sc.desc}
                </p>
              </div>

              <Link
                to={sc.link}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-slate-950 text-cyan-400 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Scan Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
