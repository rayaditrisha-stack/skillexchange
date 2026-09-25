import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConstellationField from '../components/ConstellationField';
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Quote,
  TrendingUp,
  Loader2,
  X,
  Sparkles
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
      setError('Please provide both your campus email and password.');
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
    <div className="relative min-h-screen bg-[#04060A] text-slate-100 font-sans selection:bg-amber-400/20 selection:text-amber-200 flex overflow-hidden">
      {/* Background Constellation Effect */}
      <ConstellationField />
      <div className="absolute inset-0 bg-gradient-to-r from-[#04060A] via-[#04060A]/90 to-[#04060A] pointer-events-none z-0" />

      {/* Main Split Layout Container */}
      <div className="relative z-10 flex w-full min-h-screen">
        
        {/* LEFT PANEL: Atmospheric Showcase (Hidden on mobile, 45% width on desktop) */}
        <div className="hidden lg:flex lg:w-[45%] bg-white/[0.01] backdrop-blur-xl border-r border-white/[0.08] p-12 flex-col justify-between relative overflow-hidden">
          {/* Ambient Warm Glow Orbs */}
          <div className="absolute top-1/4 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="bg-amber-400/10 border border-amber-400/20 text-amber-200 p-2.5 rounded-xl backdrop-blur-md flex items-center justify-center group-hover:bg-amber-400/20 transition-colors">
                <Sparkles className="w-5 h-5 text-amber-200 fill-amber-200/20" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-xl tracking-tight text-white font-sans">SkillMesh</span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Campus Barter Protocol</span>
              </div>
            </Link>
          </div>

          {/* Middle Showcase: Testimonial & Live Metric */}
          <div className="relative z-10 space-y-8 my-auto max-w-lg">
            {/* Live Metric Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-200 text-xs font-mono shadow-[0_0_20px_rgba(212,175,55,0.12)]">
              <TrendingUp className="w-4 h-4 text-amber-300" />
              <span>Over 1,200 peer hours exchanged this semester</span>
            </div>

            {/* Testimonial Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] relative backdrop-blur-md space-y-4">
              <Quote className="w-8 h-8 text-amber-400/30" />
              <p className="text-sm text-slate-300 leading-relaxed font-normal italic">
                "I taught React to two sophomores in exchange for 4 hours of machine learning mentoring. SkillMesh allowed me to land my AI internship without spending a single dollar."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-200 font-bold text-xs flex items-center justify-center font-mono">
                  AR
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Alex Rivera</div>
                  <div className="text-[10px] text-slate-400 font-mono">Senior CS Major • Verified Peer Mentor</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer info */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>© 2026 SkillMesh Protocol</span>
            <span className="flex items-center gap-1.5 text-amber-200/90">
              <ShieldCheck className="w-4 h-4 text-amber-300" /> Dual Escrow Enabled
            </span>
          </div>
        </div>

        {/* RIGHT PANEL: Minimalist Focused Login Form */}
        <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/90">
            
            {/* Form Title Header */}
            <div>
              <div className="flex items-center gap-2 lg:hidden mb-6">
                <div className="bg-amber-400/10 border border-amber-400/20 text-amber-200 p-2 rounded-xl">
                  <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200/20" />
                </div>
                <span className="font-semibold text-lg text-white font-sans">SkillMesh</span>
              </div>
              <h1 className="text-3xl font-semibold text-white tracking-tight mb-2 font-sans">Welcome Back</h1>
              <p className="text-xs text-slate-400">
                Sign in with your campus credentials to access your peer barter dashboard.
              </p>
            </div>

            {/* Inline Error Banner */}
            {error && (
              <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs flex items-start gap-2.5">
                <X className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                  Campus Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 text-slate-100 rounded-xl placeholder-slate-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-white/[0.03] border border-white/10 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 text-slate-100 rounded-xl placeholder-slate-500 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Solid Platinum White CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Campus Mesh</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Subtext link */}
            <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-300 font-semibold hover:underline">
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
