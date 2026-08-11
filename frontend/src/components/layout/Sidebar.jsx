import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Scan,
  History,
  ShieldAlert,
  FileText,
  Settings,
  Mail,
  Globe,
  FileSpreadsheet,
  CreditCard,
  QrCode,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const mainLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/scan', label: 'Scan Center', icon: Scan },
    { to: '/history', label: 'Scan History', icon: History },
    { to: '/alerts', label: 'Security Alerts', icon: ShieldAlert },
    { to: '/reports', label: 'Reports Archive', icon: FileText },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const scannerQuickLinks = [
    { to: '/scan/email', label: 'Email Scanner', icon: Mail },
    { to: '/scan/url', label: 'URL Scanner', icon: Globe },
    { to: '/scan/invoice', label: 'Invoice Scanner', icon: FileSpreadsheet },
    { to: '/scan/payment', label: 'Payment Scanner', icon: CreditCard },
    { to: '/scan/qr', label: 'QR Scanner', icon: QrCode },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-[65px] left-0 z-40 w-64 h-screen lg:h-[calc(100vh-65px)] bg-[#0D1322] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Main Nav */}
          <div>
            <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase px-3 mb-2">
              Main Menu
            </div>
            <nav className="space-y-1">
              {mainLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Scanner Links */}
          <div>
            <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase px-3 mb-2">
              Fraud Scanners
            </div>
            <nav className="space-y-1">
              {scannerQuickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Prototype Footer Banner */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/20 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLEGE PROTOTYPE</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              AI-powered deterministic risk analysis engine demo.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
