import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Mail,
  Globe,
  FileSpreadsheet,
  CreditCard,
  QrCode,
  Lock,
  Cpu,
  CheckCircle,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                SECUREMSME <span className="text-cyan-400 font-mono text-sm px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">AI</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-cyan-400 px-4 py-2 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/scan"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
            >
              <span>Scan Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Ambient Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>COLLEGE PROJECT DEMO / AI PROTOTYPE</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
          SECURE YOUR BUSINESS. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            STOP DIGITAL FRAUD.
          </span>
        </h1>

        <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          "AI-powered prototype for detecting suspicious emails, websites, invoices, payment screenshots and QR codes."
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/scan"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Scan Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 transition-all"
          >
            Explore Protection
          </Link>
        </div>

        {/* Cybersecurity Dashboard Futuristic Preview Mockup */}
        <div className="relative max-w-5xl mx-auto rounded-2xl glass-panel-glow p-4 md:p-6 border border-cyan-500/30 shadow-2xl text-left">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-cyan-400">https://securemsme.ai/dashboard</span>
            </div>
            <span className="font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              AI Engine Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Security Score</div>
              <div className="text-3xl font-black text-cyan-400">88 / 100</div>
              <div className="text-[11px] text-emerald-400 mt-1">✓ Optimal MSME Protection</div>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Scans Analyzed</div>
              <div className="text-3xl font-black text-white">142</div>
              <div className="text-[11px] text-slate-400 mt-1">Across 5 Attack Vectors</div>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Threats Intercepted</div>
              <div className="text-3xl font-black text-rose-400">14</div>
              <div className="text-[11px] text-rose-400 mt-1">100% Explainable Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Feature Cards */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Multi-Vector Fraud Scanner
          </h2>
          <p className="text-sm text-slate-400">
            Comprehensive digital fraud detection tailored for Micro, Small & Medium Enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: 'AI Email Scanner', desc: 'Detects urgency, phishing links, and sender domain spoofing.', icon: Mail, color: 'text-cyan-400' },
            { title: 'URL Scanner', desc: 'Analyzes IP hosts, missing HTTPS, and typosquatting keywords.', icon: Globe, color: 'text-blue-400' },
            { title: 'Invoice Analysis', desc: 'OCR extraction & structural validation of GSTIN & billing fields.', icon: FileSpreadsheet, color: 'text-purple-400' },
            { title: 'Payment Verification', desc: 'Parses screenshot text for UTR transaction ID authenticity.', icon: CreditCard, color: 'text-emerald-400' },
            { title: 'QR Security', desc: 'Decodes QR payloads & evaluates malicious redirect destinations.', icon: QrCode, color: 'text-amber-400' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all group">
                <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${item.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80 bg-slate-950/40 rounded-3xl mb-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            How It Works
          </h2>
          <p className="text-sm text-slate-400">
            Simple 4-step explainable AI fraud analysis pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { step: '01', title: 'User Input', desc: 'Paste email text, URL link, or upload invoice/payment image.', icon: Eye },
            { step: '02', title: 'AI Analysis', desc: 'OpenCV image preprocessing & Tesseract OCR text extraction.', icon: Cpu },
            { step: '03', title: 'Risk Score', desc: 'Deterministic feature scoring generates 0-100 risk score.', icon: Layers },
            { step: '04', title: 'Recommendation', desc: 'Receive explainable XAI score breakdown and safety advice.', icon: CheckCircle }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
                <div className="text-3xl font-black text-slate-700 mb-2 font-mono">{item.step}</div>
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <p className="mb-2">
          SECUREMSME AI — College Project Prototype / Demo.
        </p>
        <p className="max-w-2xl mx-auto text-[11px] text-slate-600">
          "AI-powered prototype analysis. Does not perform real bank transaction verification or official GST database lookups."
        </p>
      </footer>
    </div>
  );
};
