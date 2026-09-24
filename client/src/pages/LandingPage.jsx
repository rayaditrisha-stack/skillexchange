import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SkillBadge from '../components/SkillBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  Zap,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Award,
  Users,
  Code2,
  Cpu,
  Palette,
  Globe2,
  Share2
} from 'lucide-react';

export default function LandingPage() {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [swapModalUser, setSwapModalUser] = useState(null);
  const [requestSkill, setRequestSkill] = useState('');
  const [requestNotes, setRequestNotes] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  const categories = ['All', 'React.js', 'Machine Learning', 'Docker & Kubernetes', 'Figma & UI/UX Design', 'Solidity & Web3 Contracts', 'Python Data Science'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/users?search=${encodeURIComponent(searchTerm)}&level=${selectedLevel}`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load campus peers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, selectedLevel]);

  const handleOpenSwapModal = (peer) => {
    if (!user) {
      showToast('Please log in or register to request a skill swap.', 'info');
      navigate('/login');
      return;
    }
    setSwapModalUser(peer);
    if (peer.skillsOffered && peer.skillsOffered.length > 0) {
      setRequestSkill(peer.skillsOffered[0].skillName);
    }
  };

  const handleSendSwapRequest = async (e) => {
    e.preventDefault();
    if (!requestSkill) {
      showToast('Please select a skill to learn.', 'error');
      return;
    }

    try {
      setRequestLoading(true);
      const res = await axios.post('/api/swaps', {
        peerId: swapModalUser._id,
        skillName: requestSkill,
        role: 'learner',
        notes: requestNotes || `Hi ${swapModalUser.name}, I would love to learn ${requestSkill} from you!`
      });

      if (res.data.success) {
        showToast(`🎉 Swap request sent to ${swapModalUser.name}! 1 Escrow Credit held.`, 'success');
        setSwapModalUser(null);
        setRequestNotes('');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send swap request.', 'error');
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-grid-pattern pb-20">
      
      {/* Dynamic Background Glow Spots */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] gradient-glow-violet blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-[500px] h-[300px] gradient-glow-emerald blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold shadow-lg shadow-emerald-950/40 backdrop-blur-md animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Decentralized Campus Skill Protocol</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Trade Knowledge, Not Money.{' '}
          <span className="text-gradient-primary">Bilateral Campus Skill Exchange.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          SkillMesh connects verified university peers for zero-cash skill swapping. Teach what you excel at, learn what you need, protected by dual-confirmation escrow credits.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={user ? "/dashboard" : "/register"}
            className="btn-shimmer w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:opacity-95 shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 fill-slate-950" />
            {user ? "Go to Dashboard" : "Claim 3 Free Escrow Credits"}
          </Link>
          <a
            href="#explorer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-200 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5 text-violet-400" />
            Browse Campus Peers
          </a>
        </div>

        {/* Live Dynamic Stats Ticker */}
        <div className="pt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="glass-card p-5 rounded-2xl text-center space-y-1">
            <p className="text-3xl font-extrabold text-white tracking-tight">1,420+</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Campus Swaps</p>
          </div>
          <div className="glass-card p-5 rounded-2xl text-center space-y-1">
            <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">4,260</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Escrow Credits Traded</p>
          </div>
          <div className="glass-card p-5 rounded-2xl text-center space-y-1">
            <p className="text-3xl font-extrabold text-violet-400 tracking-tight">85+</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Campus Domains</p>
          </div>
          <div className="glass-card p-5 rounded-2xl text-center space-y-1">
            <p className="text-3xl font-extrabold text-sky-400 tracking-tight">4.9 / 5.0</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peer Reputation Score</p>
          </div>
        </div>

      </section>

      {/* Escrow Engine Breakdown Section */}
      <section className="py-16 border-y border-slate-900 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Decentralized Trust Protocol
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              How The Escrow Engine Works
            </h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Our automated 3-step escrow mechanism guarantees fair exchange without financial currency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="glass-card glass-card-hover p-8 rounded-2xl border border-slate-800 space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-extrabold text-lg">
                01
              </div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-violet-400" />
                Match & Escrow Hold
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                When you request a session, 1 Escrow Credit is held in smart protocol lock. Neither party loses credit until knowledge is delivered.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card glass-card-hover p-8 rounded-2xl border border-slate-800 space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-extrabold text-lg">
                02
              </div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                1:1 Campus Session
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Meet in person or online. Work through code, machine learning pipelines, Figma designs, or test prep using proof-verified materials.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card glass-card-hover p-8 rounded-2xl border border-slate-800 space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg">
                03
              </div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                Dual Signature Release
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Both mentor and learner click "Mark Completed". Escrow credit automatically transfers to mentor, boosting both peer reputation scores!
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Live Skill Explorer Preview */}
      <section id="explorer" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Globe2 className="w-7 h-7 text-emerald-400" />
              Live Campus Skill Explorer
            </h3>
            <p className="text-slate-400 text-sm">
              Discover verified campus mentors from MIT, Stanford, IIT, Oxford, Berkeley, and beyond.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Showing {users.length} Active Peers
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center">
          
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills (e.g. React, PyTorch, Figma, Docker)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:border-violet-500"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>Level: {lvl}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSearchTerm(cat === 'All' ? '' : cat);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                (cat === 'All' && !searchTerm) || searchTerm === cat
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Peer Grid */}
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : users.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <p className="text-slate-400 text-base font-semibold">No campus peers found matching "{searchTerm}".</p>
            <p className="text-slate-500 text-xs">Try searching for "React", "Machine Learning", "Figma", or "Docker".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((peer) => (
              <div
                key={peer._id}
                className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base leading-snug flex items-center gap-1.5">
                        {peer.name}
                        <ShieldCheck className="w-4 h-4 text-emerald-400" title="Campus Domain Verified" />
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">{peer.campusName || 'Campus Node'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                    ★ {peer.reputationScore ? peer.reputationScore.toFixed(1) : '4.9'}
                  </div>
                </div>

                {/* Skills Offered */}
                <div className="space-y-2">
                  <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Can Teach ({peer.skillsOffered?.length || 0}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {peer.skillsOffered && peer.skillsOffered.length > 0 ? (
                      peer.skillsOffered.map((sk, idx) => (
                        <SkillBadge
                          key={idx}
                          skill={sk.skillName}
                          level={sk.level}
                          proofUrl={sk.proofUrl}
                          verified={sk.verified}
                        />
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">General Peer</span>
                    )}
                  </div>
                </div>

                {/* Skills Needed */}
                <div className="space-y-2 pt-1 border-t border-slate-800/60">
                  <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Wants to Learn:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {peer.skillsNeeded && peer.skillsNeeded.length > 0 ? (
                      peer.skillsNeeded.map((needed, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                          {needed}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">Open to all skills</span>
                    )}
                  </div>
                </div>

                {/* Request Swap Action */}
                <button
                  onClick={() => handleOpenSwapModal(peer)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 group"
                >
                  <Zap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  Request Skill Swap
                </button>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* Swap Request Modal */}
      {swapModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-slate-700 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img src={swapModalUser.avatar} className="w-10 h-10 rounded-lg bg-slate-800" />
                <div>
                  <h3 className="font-bold text-white text-base">Swap Request to {swapModalUser.name}</h3>
                  <p className="text-xs text-slate-400">{swapModalUser.campusName}</p>
                </div>
              </div>
              <button
                onClick={() => setSwapModalUser(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendSwapRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Skill You Want to Learn:
                </label>
                <select
                  value={requestSkill}
                  onChange={(e) => setRequestSkill(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500"
                >
                  {swapModalUser.skillsOffered?.map((sk, idx) => (
                    <option key={idx} value={sk.skillName}>
                      {sk.skillName} ({sk.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Message / Session Plan:
                </label>
                <textarea
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="Hey, let's schedule a session next week!"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1 Escrow Credit will be held. Released only upon dual confirmation.</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSwapModalUser(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requestLoading}
                  className="btn-shimmer px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95"
                >
                  {requestLoading ? 'Sending...' : 'Confirm Escrow & Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
