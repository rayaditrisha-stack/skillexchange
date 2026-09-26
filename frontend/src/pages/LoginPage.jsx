import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConstellationField from '../components/ConstellationField';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Quote,
  TrendingUp,
  Loader2,
  X
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const result = await login(email.trim(), password);
      if (result && result.success) {
        navigate('/dashboard');
      } else if (result && result.message) {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen transition-colors duration-300 dark:bg-[#040507] bg-[#F7F7F8] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-500 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <ConstellationField />

      <div className="relative z-10 w-full max-w-md">
        <div className="dark:bg-[#08090C]/90 bg-white/90 border dark:border-white/[0.07] border-black/[0.08] shadow-2xl rounded-3xl p-8 sm:p-10 backdrop-blur-2xl space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300 text-[10px] font-mono tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTHENTICATION TELEMETRY</span>
            </div>
            <h1 className="text-3xl font-bold dark:text-white text-slate-900 tracking-tight font-sans">
              Welcome Back.{' '}
              <span className="font-serif italic font-normal text-amber-600 dark:text-amber-300">
                Sign In.
              </span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">
              Access your campus peer barter dashboard & escrow ledger.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs flex items-start gap-2.5 font-mono">
              <X className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com or campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 dark:bg-black/40 bg-slate-50 border dark:border-white/10 border-black/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 rounded-2xl transition-all text-xs font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 dark:bg-black/40 bg-slate-50 border dark:border-white/10 border-black/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 rounded-2xl transition-all text-xs font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full dark:bg-white dark:text-slate-950 bg-slate-900 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Node</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch Link */}
          <div className="pt-4 border-t dark:border-white/10 border-black/10 text-center text-xs text-slate-500 dark:text-slate-400 font-sans">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-500 font-bold hover:underline font-mono">
              Create one
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
