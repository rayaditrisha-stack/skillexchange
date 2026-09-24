import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export default function LoginPage() {
  const { login, demoLogin, showToast } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('Login failed. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoName) => {
    setErrorMessage('');
    try {
      setLoading(true);
      showToast(`Logging in as Demo User: ${demoName}...`, 'info');
      const res = await demoLogin(demoEmail);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row bg-grid-pattern">
      
      {/* Left Side: Branded Showcase & Linear/Vercel Aesthetic */}
      <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-900 relative overflow-hidden bg-slate-950/80 backdrop-blur-xl">
        
        {/* Background Glows */}
        <div className="absolute top-10 left-10 w-96 h-96 gradient-glow-violet blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 gradient-glow-emerald blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 space-y-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-violet-600 p-0.5 shadow-lg shadow-emerald-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              SkillMesh Protocol
            </span>
          </Link>

          <div className="space-y-4 pt-4">
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Decentralized Campus Knowledge Exchange.
            </h1>
            <p className="text-slate-400 text-sm lg:text-base leading-relaxed max-w-lg">
              Empowering university students to swap skills seamlessly through dual-confirmation escrow credits and verified peer reputation.
            </p>
          </div>
        </div>

        {/* Live Escrow Widget Preview Card */}
        <div className="relative z-10 my-8 glass-card p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl max-w-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              PROTOCOL ESCROW ENGINE ACTIVE
            </div>
            <span className="text-xs text-slate-400 font-mono">MIT Node #402</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-violet-400 text-xs">
                AC
              </div>
              <div>
                <p className="text-xs font-bold text-white">Alex Chen (MIT)</p>
                <p className="text-[11px] text-slate-400">Teaching React.js to Sophia</p>
              </div>
            </div>

            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                ⚡ 1 Escrow Held
              </span>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="relative z-10 text-xs text-slate-500 border-t border-slate-900 pt-4 flex items-center justify-between">
          <span>Protected by JWT HTTPOnly Cookies & Bcrypt Hashing</span>
          <span className="text-emerald-400 font-mono">SSL 256-bit</span>
        </div>

      </div>

      {/* Right Side: Accessible Login Form */}
      <div className="w-full md:w-1/2 p-8 lg:p-16 flex items-center justify-center relative">
        <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative z-10">
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-400">
              Sign in to manage your skill swap sessions and escrow balance.
            </p>
          </div>

          {/* Quick 1-Click Demo Logins */}
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              ⚡ Instant 1-Click Demo Accounts:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('alex.chen@mit.edu', 'Alex (MIT)')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-emerald-400 transition-colors text-center"
              >
                Alex (MIT)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('sophia.p@stanford.edu', 'Sophia (Stanford)')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-violet-400 transition-colors text-center"
              >
                Sophia (Stanford)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('marcus.v@iit.ac.in', 'Marcus (IIT)')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-sky-400 transition-colors text-center"
              >
                Marcus (IIT)
              </button>
            </div>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-950 px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest absolute">
              OR LOGIN WITH EMAIL
            </span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campus Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Campus Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="alex.chen@mit.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-0"
                />
                Remember me on this browser
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Footer link */}
          <div className="text-center pt-2 border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              New to SkillMesh?{' '}
              <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
