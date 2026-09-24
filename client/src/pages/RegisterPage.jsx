import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Zap,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function RegisterPage() {
  const { register, showToast } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campusName, setCampusName] = useState('MIT Campus');

  // Step 2: Offered Skills
  const [offeredSkills, setOfferedSkills] = useState([
    { skillName: 'React.js', level: 'Intermediate', proofUrl: '' }
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [newSkillProof, setNewSkillProof] = useState('');

  // Step 3: Needed Skills / Wishlist
  const [neededSkills, setNeededSkills] = useState(['Machine Learning', 'UI/UX Design']);
  const [newNeededTag, setNewNeededTag] = useState('');

  // Campus Email Regex
  const campusRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac\.in|edu\.[a-z]{2}|ac\.[a-z]{2}|org)$/i;

  // Password Strength Calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score: 66, label: 'Medium', color: 'bg-amber-500' };
    return { score: 100, label: 'Strong & Secure', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleStep1Next = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!campusRegex.test(email)) {
      setErrorMessage('Valid campus email required (must end with .edu, .ac.in, etc).');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setStep(2);
  };

  const handleAddOfferedSkill = () => {
    if (!newSkillName.trim()) return;
    setOfferedSkills([
      ...offeredSkills,
      { skillName: newSkillName.trim(), level: newSkillLevel, proofUrl: newSkillProof.trim() }
    ]);
    setNewSkillName('');
    setNewSkillProof('');
  };

  const handleRemoveOfferedSkill = (index) => {
    setOfferedSkills(offeredSkills.filter((_, i) => i !== index));
  };

  const handleAddNeededTag = () => {
    if (!newNeededTag.trim()) return;
    if (!neededSkills.includes(newNeededTag.trim())) {
      setNeededSkills([...neededSkills, newNeededTag.trim()]);
    }
    setNewNeededTag('');
  };

  const handleRemoveNeededTag = (tag) => {
    setNeededSkills(neededSkills.filter(t => t !== tag));
  };

  const handleSubmitFinal = async () => {
    setErrorMessage('');
    try {
      setLoading(true);
      const res = await register({
        name,
        email,
        password,
        campusName,
        skillsOffered: offeredSkills.length > 0 ? offeredSkills : [{ skillName: 'General Skills', level: 'Intermediate' }],
        skillsNeeded: neededSkills
      });

      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 bg-grid-pattern relative">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] gradient-glow-emerald blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full glass-card rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative z-10">
        
        {/* Card Header & Step Indicator */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Campus Onboarding • Step {step} of 3</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Join SkillMesh Campus Exchange
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign up with your campus email to claim <span className="text-emerald-400 font-bold">3 Free Escrow Credits</span>.
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-400 to-violet-600 h-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Credentials */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            {/* Campus Email */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">Campus Email (.edu / .ac.in)</label>
                {email && (
                  <span className={`text-[10px] font-mono font-bold ${campusRegex.test(email) ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {campusRegex.test(email) ? '✓ Valid Campus Domain' : 'Campus domain required'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="alex.chen@mit.edu or marcus@iit.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            {/* Campus Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">University / Campus Node</label>
              <input
                type="text"
                placeholder="e.g. MIT, Stanford, IIT Bombay"
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum 6 characters"
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

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Strength:</span>
                    <span className="font-semibold text-slate-200">{strength.label}</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-shimmer w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              Continue to Skill Selector
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

        {/* STEP 2: What Can You Teach? */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                What Can You Teach?
              </h3>
              <p className="text-xs text-slate-400">List skills you can mentor fellow students in.</p>
            </div>

            {/* Added Skills List */}
            <div className="space-y-2">
              {offeredSkills.map((sk, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white">{sk.skillName}</span>
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {sk.level}
                    </span>
                    {sk.proofUrl && (
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">{sk.proofUrl}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveOfferedSkill(idx)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Form */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-3">
              <p className="text-xs font-semibold text-slate-300">Add Skill to Offer:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="e.g. PyTorch, Next.js, Figma"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <input
                type="url"
                placeholder="Proof URL (GitHub, Portfolio, Cert - optional)"
                value={newSkillProof}
                onChange={(e) => setNewSkillProof(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddOfferedSkill}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                Add Skill to List
              </button>
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-shimmer px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95 flex items-center gap-1.5"
              >
                Next: Wishlist
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: What Do You Want to Learn? */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Zap className="w-5 h-5 text-violet-400" />
                What Do You Want to Learn?
              </h3>
              <p className="text-xs text-slate-400">Your wishlist helps our Match Engine connect you with peers.</p>
            </div>

            {/* Wishlist Tags */}
            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-xl bg-slate-900 border border-slate-800">
              {neededSkills.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold"
                >
                  {tag}
                  <button onClick={() => handleRemoveNeededTag(tag)} className="hover:text-rose-400">
                    ✕
                  </button>
                </span>
              ))}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill tag (e.g. Docker, System Design)"
                value={newNeededTag}
                onChange={(e) => setNewNeededTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNeededTag())}
                className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
              <button
                type="button"
                onClick={handleAddNeededTag}
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
              >
                Add
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>You will immediately receive 3 Escrow Credits upon completing signup!</span>
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmitFinal}
                className="btn-shimmer px-8 py-3.5 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:opacity-95 shadow-xl shadow-emerald-500/20 flex items-center gap-2"
              >
                {loading ? 'Creating Campus Node...' : 'Complete & Launch Dashboard'}
                <Sparkles className="w-4 h-4 fill-slate-950" />
              </button>
            </div>
          </div>
        )}

        {/* Already have an account link */}
        <div className="text-center border-t border-slate-800/80 pt-4">
          <p className="text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
              Log in to your account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
