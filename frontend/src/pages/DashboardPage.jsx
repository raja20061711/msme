import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Scan,
  AlertTriangle,
  AlertOctagon,
  ArrowUpRight,
  TrendingUp,
  PieChart as PieIcon,
  Activity,
  ArrowRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardSummary();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-mono">Loading Security Telemetry...</p>
      </div>
    );
  }

  const { summary, charts, recentScans } = data;

  const COLORS = ['#06B6D4', '#38BDF8', '#8B5CF6', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            {getGreeting()}, {user?.ownerName || 'Business Owner'} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active Security Telemetry • Business: <span className="text-cyan-400 font-semibold">{user?.businessName || 'Apex Enterprise'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/scan"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Scan className="w-4 h-4" />
            <span>Launch Scanner</span>
          </Link>
        </div>
      </div>

      {/* Security Overview 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Security Score */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Security Score</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{summary.securityScore} <span className="text-xs text-slate-400 font-sans">/ 100</span></div>
          <div className="text-[11px] text-emerald-400 mt-2 font-medium">
            ✓ Optimal MSME Protection
          </div>
        </div>

        {/* Card 2: Total Scans */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Scans</span>
            <Scan className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{summary.totalScans}</div>
          <div className="text-[11px] text-slate-400 mt-2">
            Across Emails, URLs, Invoices & QR
          </div>
        </div>

        {/* Card 3: Threats Detected */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Threats Flagged</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{summary.threatsDetected}</div>
          <div className="text-[11px] text-amber-400/80 mt-2">
            Medium & High Risk combined
          </div>
        </div>

        {/* Card 4: High Risk Alerts */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">High Risk Alerts</span>
            <AlertOctagon className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">{summary.highRiskAlerts}</div>
          <div className="text-[11px] text-rose-400/80 mt-2">
            Action required immediately
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Threat Detection Trend (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Threat Detection Trend
              </h3>
              <p className="text-xs text-slate-400">Weekly scan volume and threat interception telemetry</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.trendData}>
                <defs>
                  <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="threatsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="scans" stroke="#06B6D4" fillOpacity={1} fill="url(#scansGrad)" strokeWidth={2} name="Total Scans" />
                <Area type="monotone" dataKey="threats" stroke="#EF4444" fillOpacity={1} fill="url(#threatsGrad)" strokeWidth={2} name="Threats Intercepted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Scan Distribution & Threat Types */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-purple-400" />
              Threat Classification
            </h3>
            <p className="text-xs text-slate-400 mb-4">Risk level distribution ratio</p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.threatTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.threatTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-center justify-around text-xs border-t border-slate-800 pt-3">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Safe</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Medium</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> High</div>
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Security Scans</h3>
            <p className="text-xs text-slate-400">Real-time analysis stream from database</p>
          </div>
          <Link to="/history" className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1">
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Scan Type</th>
                <th className="py-3.5 px-6">Target / Subject</th>
                <th className="py-3.5 px-6">Risk Score</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentScans.map((scan) => (
                <tr key={scan._id || scan.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 text-slate-400 whitespace-nowrap">
                    {new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {scan.type}
                  </td>
                  <td className="py-4 px-6 font-medium text-white max-w-xs truncate">
                    {scan.target}
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-slate-200 whitespace-nowrap">
                    {scan.riskScore} / 100
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <RiskBadge level={scan.riskLevel} />
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <Link
                      to={`/results/${scan._id || scan.id}`}
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
