import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConstellationField from '../components/ConstellationField';
import {
  Zap,
  Check,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  User,
  Plus,
  X,
  Code2,
  BookOpen,
  Award,
  Link2,
  Sparkles
} from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step 1 Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    campusName: 'Main Campus'
  });

  // Step 2 Form Data: Teach Skills
  const [teachSkills, setTeachSkills] = useState([
    { skillName: 'React.js', level: 'Advanced', proofUrl: 'https://github.com/my-profile' }
  ]);
  const [teachInput, setTeachInput] = useState('');

  // Step 3 Form Data: Learn Skills
  const [learnSkills, setLearnSkills] = useState(['Machine Learning', 'Docker & K8s']);
  const [learnInput, setLearnInput] = useState('');

  // Quick suggestion pills for Step 3
  const popularSuggestions = [
    'Node.js',
    'Docker & K8s',
    'UI/UX Design',
    'Data Structures',
    'Solidity / Web3',
    'Python for AI',
    'TypeScript',
    'System Design'
  ];

  // Password Strength Calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-300 dark:bg-slate-800' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-amber-500/20 border border-amber-500/30' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500/40' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-amber-500/70' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-amber-500 dark:bg-amber-300' };
      default:
        return { score: 0, label: 'Weak', color: 'bg-slate-200 dark:bg-black/40' };
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Step 1 Validation & Next
  const handleStep1Next = (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setStep(2);
  };

  // Step 2: Add Teach Skill Tag
  const handleAddTeachSkill = (skillToAdd) => {
    const val = (skillToAdd || teachInput).trim();
    if (!val) return;
    if (teachSkills.some((s) => s.skillName.toLowerCase() === val.toLowerCase())) {
      setTeachInput('');
      return;
    }
    setTeachSkills([
      ...teachSkills,
      { skillName: val, level: 'Intermediate', proofUrl: '' }
    ]);
    setTeachInput('');
  };

  const handleRemoveTeachSkill = (index) => {
    setTeachSkills(teachSkills.filter((_, i) => i !== index));
  };

  const handleUpdateTeachSkill = (index, field, value) => {
    const updated = [...teachSkills];
    updated[index][field] = value;
    setTeachSkills(updated);
  };

  const handleStep2Next = (e) => {
    e.preventDefault();
    setError('');
    if (teachSkills.length === 0) {
      setError('Please add at least one skill you can teach.');
      return;
    }
    setStep(3);
  };

  // Step 3: Add/Remove Learn Skill Tag
  const handleAddLearnSkill = (skillToAdd) => {
    const val = (skillToAdd || learnInput).trim();
    if (!val) return;
    if (learnSkills.some((s) => s.toLowerCase() === val.toLowerCase())) {
      setLearnInput('');
      return;
    }
    setLearnSkills([...learnSkills, val]);
    setLearnInput('');
  };

  const handleRemoveLearnSkill = (skillToRemove) => {
    setLearnSkills(learnSkills.filter((s) => s !== skillToRemove));
  };

  // Final Registration Submission
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    setError('');
    if (learnSkills.length === 0) {
      setError('Please select or add at least one skill you want to learn.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        campusName: formData.campusName.trim() || 'Campus Node',
        skillsOffered: teachSkills.map((s) => ({
          skillName: s.skillName,
          level: s.level,
          proofUrl: s.proofUrl
        })),
        skillsNeeded: learnSkills.map((s) => (typeof s === 'string' ? s : s.skillName || s))
      };

      const result = await register(payload);
      if (result && result.success) {
        navigate('/dashboard');
      } else if (result && result.message) {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen transition-colors duration-300 dark:bg-[#040507] bg-[#F7F7F8] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-500 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <ConstellationField />

      {/* Onboarding Container */}
      <div className="relative z-10 w-full max-w-2xl dark:bg-[#08090C]/90 bg-white/90 border dark:border-white/[0.07] border-black/[0.08] shadow-2xl rounded-3xl p-6 sm:p-10 my-8 backdrop-blur-2xl">
        
        {/* Header Branding */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 fill-amber-500/20" />
            </div>
            <span className="font-extrabold text-sm tracking-widest text-slate-900 dark:text-white uppercase font-sans">SKILLMESH</span>
          </Link>
          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 font-bold">
            STEP {step} OF 3
          </span>
        </div>

        {/* Stepper Progress Bar Header */}
        <div className="mb-10">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 relative">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm font-mono transition-all duration-300 ${
                  step > 1
                    ? 'bg-amber-500 text-white dark:text-slate-950 shadow-md'
                    : step === 1
                    ? 'dark:bg-black bg-white text-amber-500 border-2 border-amber-500 shadow-md'
                    : 'dark:bg-white/5 bg-slate-100 text-slate-400 border dark:border-white/10 border-black/10'
                }`}
              >
                {step > 1 ? <Check className="w-5 h-5 stroke-[3]" /> : '1'}
              </div>
              <span className={`text-[10px] uppercase font-mono tracking-widest mt-2 font-bold ${step === 1 ? 'text-amber-500' : 'text-slate-400'}`}>
                ACCOUNT
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm font-mono transition-all duration-300 ${
                  step > 2
                    ? 'bg-amber-500 text-white dark:text-slate-950 shadow-md'
                    : step === 2
                    ? 'dark:bg-black bg-white text-amber-500 border-2 border-amber-500 shadow-md'
                    : 'dark:bg-white/5 bg-slate-100 text-slate-400 border dark:border-white/10 border-black/10'
                }`}
              >
                {step > 2 ? <Check className="w-5 h-5 stroke-[3]" /> : '2'}
              </div>
              <span className={`text-[10px] uppercase font-mono tracking-widest mt-2 font-bold ${step === 2 ? 'text-amber-500' : 'text-slate-400'}`}>
                TEACH
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm font-mono transition-all duration-300 ${
                  step === 3
                    ? 'dark:bg-black bg-white text-amber-500 border-2 border-amber-500 shadow-md'
                    : 'dark:bg-white/5 bg-slate-100 text-slate-400 border dark:border-white/10 border-black/10'
                }`}
              >
                3
              </div>
              <span className={`text-[10px] uppercase font-mono tracking-widest mt-2 font-bold ${step === 3 ? 'text-amber-500' : 'text-slate-400'}`}>
                LEARN
              </span>
            </div>
          </div>

          <div className="relative mt-3 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-amber-500 transition-all duration-500 ease-out"
              style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
            />
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs flex items-center gap-2 font-mono">
            <X className="w-4 h-4 shrink-0 text-amber-500" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: CREDENTIALS */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 font-sans">Create Your Node Account</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">Join the peer-to-peer campus skill barter network.</p>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                FULL NAME / CALLSIGN
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 dark:bg-black/40 bg-slate-50 border dark:border-white/10 border-black/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 rounded-2xl transition-colors text-xs font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="alex@gmail.com or campus.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 dark:bg-black/40 bg-slate-50 border dark:border-white/10 border-black/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 rounded-2xl transition-colors text-xs font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 dark:bg-black/40 bg-slate-50 border dark:border-white/10 border-black/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 rounded-2xl transition-colors text-xs font-sans"
                />
              </div>

              {formData.password && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Password Strength:</span>
                    <span className="text-amber-500 font-bold">{passwordStrength.label}</span>
                  </div>
                  <div className="h-1.5 w-full dark:bg-black/40 bg-slate-100 rounded-full overflow-hidden flex gap-1 p-0.5 border dark:border-white/5 border-black/5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'
                      }`}
                      style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full dark:bg-white dark:text-slate-950 bg-slate-900 text-white font-mono uppercase text-xs tracking-wider font-semibold hover:opacity-90 shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Continue to Skills Offered</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </button>
          </form>
        )}

        {/* STEP 2: WHAT CAN YOU TEACH? */}
        {step === 2 && (
          <form onSubmit={handleStep2Next} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 font-sans">What Can You Teach?</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">
                Catalog your expertise. Other students will exchange their skills for these.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                ADD SKILL NAME
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. React.js, Figma, Python"
                  value={teachInput}
                  onChange={(e) => setTeachInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTeachSkill();
                    }
                  }}
                  className="flex-1 px-4 py-3 dark:bg-black/40 bg-slate-50 border dark:border-white/10 border-black/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 rounded-2xl text-xs font-sans"
                />
                <button
                  type="button"
                  onClick={() => handleAddTeachSkill()}
                  className="px-5 py-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-amber-500" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {teachSkills.map((skill, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/10 border-black/10 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2 font-mono">
                      <Code2 className="w-4 h-4 text-amber-500" />
                      {skill.skillName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTeachSkill(index)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">
                        COMPETENCY
                      </label>
                      <select
                        value={skill.level}
                        onChange={(e) => handleUpdateTeachSkill(index, 'level', e.target.value)}
                        className="w-full px-3 py-2 dark:bg-slate-900 bg-white border dark:border-white/10 border-black/10 rounded-xl text-xs text-slate-900 dark:text-white font-sans"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">
                        PROOF LINK (OPTIONAL)
                      </label>
                      <div className="relative">
                        <Link2 className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="url"
                          placeholder="https://github.com/..."
                          value={skill.proofUrl}
                          onChange={(e) => handleUpdateTeachSkill(index, 'proofUrl', e.target.value)}
                          className="w-full pl-8 pr-3 py-2 dark:bg-slate-900 bg-white border dark:border-white/10 border-black/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 font-sans"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 px-4 rounded-full bg-slate-100 dark:bg-white/5 border dark:border-white/10 border-black/10 text-slate-700 dark:text-slate-300 font-mono text-xs uppercase font-semibold flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="w-2/3 py-3 px-6 rounded-full dark:bg-white dark:text-slate-950 bg-slate-900 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 flex items-center justify-center gap-2 shadow-md"
              >
                <span>Continue to Learning Goals</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: WHAT DO YOU WANT TO LEARN? */}
        {step === 3 && (
          <form onSubmit={handleSubmitRegistration} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 font-sans">What Do You Want to Learn?</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">
                Select skills you want to master. We'll match you with verified campus mentors.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                ADD SKILL NEEDED
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Machine Learning, Docker, Solidity"
                  value={learnInput}
                  onChange={(e) => setLearnInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLearnSkill();
                    }
                  }}
                  className="flex-1 px-4 py-3 dark:bg-black/40 bg-slate-50 border dark:border-white/10 border-black/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 rounded-2xl text-xs font-sans"
                />
                <button
                  type="button"
                  onClick={() => handleAddLearnSkill()}
                  className="px-5 py-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-amber-500" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 mb-2 uppercase flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> POPULAR CAMPUS SKILLS
              </label>
              <div className="flex flex-wrap gap-2">
                {popularSuggestions.map((s, i) => {
                  const isSelected = learnSkills.some((item) => item.toLowerCase() === s.toLowerCase());
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => (isSelected ? handleRemoveLearnSkill(s) : handleAddLearnSkill(s))}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-600 dark:text-amber-300 font-bold'
                          : 'dark:bg-white/5 bg-slate-100 dark:border-white/10 border-black/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isSelected ? `✓ ${s}` : `+ ${s}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                SELECTED GOALS ({learnSkills.length})
              </label>
              <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/10 border-black/10 min-h-[50px] items-center">
                {learnSkills.length === 0 ? (
                  <span className="text-xs text-slate-400 font-sans">No skills selected yet. Select from pills above.</span>
                ) : (
                  learnSkills.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-mono font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveLearnSkill(s)}
                        className="hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 px-4 rounded-full bg-slate-100 dark:bg-white/5 border dark:border-white/10 border-black/10 text-slate-700 dark:text-slate-300 font-mono text-xs uppercase font-semibold flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 py-3.5 px-6 rounded-full dark:bg-white dark:text-slate-950 bg-slate-900 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {submitting ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Complete Onboarding</span>
                    <Award className="w-4 h-4 text-amber-500" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t dark:border-white/10 border-black/10 text-center text-xs text-slate-500 dark:text-slate-400 font-sans">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-500 font-bold hover:underline font-mono">
            Sign In to SkillMesh
          </Link>
        </div>
      </div>
    </div>
  );
}
