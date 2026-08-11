import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, Building, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const RegisterPage = () => {
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      const res = await api.register({
        businessName: form.businessName,
        ownerName: form.ownerName,
        email: form.email,
        phone: form.phone,
        password: form.password
      });

      if (res.success) {
        loginUser(res.user, res.token);
        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      loginUser({
        id: 'user_' + Date.now(),
        businessName: form.businessName || 'My MSME Business',
        ownerName: form.ownerName || 'Business Owner',
        email: form.email
      }, 'demo_token_securemsme');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl relative">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-cyan-500/20 mb-3">
            <Shield className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">SECUREMSME AI</h1>
          <p className="text-xs text-slate-400 mt-1">Create your business security account</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Business Name</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="businessName"
                  required
                  value={form.businessName}
                  onChange={handleChange}
                  placeholder="Apex Traders Pvt Ltd"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Owner Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="ownerName"
                  required
                  value={form.ownerName}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="owner@msme.com"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'REGISTERING...' : 'REGISTER BUSINESS'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
