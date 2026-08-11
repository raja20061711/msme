import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('owner@securemsme.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login(email, password);
      if (res.success) {
        loginUser(res.user, res.token);
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError('Connection error. Continuing in demo mode.');
      loginUser({
        id: 'user_demo_1',
        businessName: 'SecureMSME Demo Enterprise',
        ownerName: 'Rahul Sharma',
        email: email
      }, 'demo_token_securemsme');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl relative">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-cyan-500/20 mb-3">
            <Shield className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">SECUREMSME AI</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to access your security portal</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN TO DASHBOARD'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
            Register Business
          </Link>
        </div>
      </div>
    </div>
  );
};
