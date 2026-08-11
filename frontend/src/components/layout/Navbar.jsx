import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Bell, Scan, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ toggleSidebar }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-500/20">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              SECUREMSME <span className="text-cyan-400 font-mono text-sm px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 tracking-wider">FRAUD DETECTION ENGINE</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Scan Action */}
        <Link
          to="/scan"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
        >
          <Scan className="w-4 h-4" />
          <span>New Scan</span>
        </Link>

        {/* Notifications Icon */}
        <Link
          to="/alerts"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="hidden md:block text-right">
            <div className="text-xs font-semibold text-white">{user?.businessName || 'Business Owner'}</div>
            <div className="text-[10px] text-slate-400">{user?.email || 'owner@msme.com'}</div>
          </div>
          <button
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            title="Logout"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
