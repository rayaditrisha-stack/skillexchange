import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SkeletonLoader from '../components/SkeletonLoader';
import MatchCard from '../components/MatchCard';
import CycleCard from '../components/CycleCard';
import SessionLedger from '../components/SessionLedger';
import SkillManagerModal from '../components/SkillManagerModal';
import SkillBadge from '../components/SkillBadge';
import {
  Zap,
  ShieldCheck,
  Plus,
  Users,
  Repeat,
  Calendar,
  Award,
  BookOpen,
  Settings,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const { user, refreshUser, showToast } = useAuth();
  const navigate = useNavigate();

  // Redirect if guest
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'triangular' | 'sessions'
  const [matches, setMatches] = useState({ directMatches: [], triangularSwaps: [], cycles: [] });
  const [sessions, setSessions] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Skill Manager Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  // Direct Swap Request Modal
  const [swapModalMatch, setSwapModalMatch] = useState(null);
  const [requestSkillName, setRequestSkillName] = useState('');
  const [requestNotes, setRequestNotes] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoadingMatches(true);
      setLoadingSessions(true);

      const [matchesRes, sessionsRes] = await Promise.all([
        axios.get('/api/matches/all').catch(() => axios.get('/api/matches/direct')),
        axios.get('/api/swaps')
      ]);

      if (matchesRes.data.success) {
        setMatches({
          directMatches: matchesRes.data.directMatches || [],
          triangularSwaps: matchesRes.data.triangularSwaps || matchesRes.data.cycles || [],
          cycles: matchesRes.data.cycles || matchesRes.data.triangularSwaps || []
        });
      }

      if (sessionsRes.data.success) {
        setSessions(sessionsRes.data.sessions || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoadingMatches(false);
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Dual Confirmation Signature Handler
  const handleConfirmSession = async (sessionId) => {
    try {
      const res = await axios.patch(`/api/swaps/${sessionId}/sign`).catch(() =>
        axios.put(`/api/swaps/${sessionId}/confirm`)
      );

      if (res.data.success) {
        showToast(res.data.message, 'success');
        await refreshUser();
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to sign session.', 'error');
    }
  };

  // Direct Swap Request Submit
  const handleSendDirectRequest = async (e) => {
    e.preventDefault();
    if (!swapModalMatch) return;

    try {
      setRequestLoading(true);
      const res = await axios.post('/api/swaps', {
        peerId: swapModalMatch.peer._id,
        skillName: requestSkillName || swapModalMatch.skillIWant || swapModalMatch.peer.skillsOffered[0]?.skillName,
        role: 'learner',
        notes: requestNotes || `Hi ${swapModalMatch.peer.name}, let's initiate our campus skill exchange!`
      });

      if (res.data.success) {
        showToast('🎉 Swap session requested! 1 Escrow Credit locked into protocol hold.', 'success');
        setSwapModalMatch(null);
        setRequestNotes('');
        await refreshUser();
        fetchData();
        setActiveTab('sessions');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to request swap.', 'error');
    } finally {
      setRequestLoading(false);
    }
  };

  // Triangular Cycle Request Handler
  const handleInitiateCycle = async (cycle) => {
    try {
      const res = await axios.post('/api/swaps', {
        peerId: cycle.userB._id,
        skillName: cycle.step1?.skill || '3-Way Cycle Skill Exchange',
        role: 'learner',
        notes: `3-Party Barter Loop requested with ${cycle.userB.name} & ${cycle.userC.name}!`
      });

      if (res.data.success) {
        showToast(`🎉 Triangular barter loop requested! 1 Escrow Credit held.`, 'success');
        await refreshUser();
        fetchData();
        setActiveTab('sessions');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to initiate triangular swap.', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-grid-pattern pb-20">
      
      {/* Top Banner & Profile Overview */}
      <section className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* User Profile Badge */}
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover bg-slate-800 border-2 border-emerald-500/40 shadow-lg shadow-emerald-950/40"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">{user.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Campus Verified Peer
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span>{user.email}</span>
                  <span>•</span>
                  <span>{user.campusName || 'Campus Node'}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics & Action Controls */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Reputation Metric */}
              <div className="glass-card px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
                <Award className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Reputation</p>
                  <p className="font-bold text-amber-300">★ {user.reputationScore ? user.reputationScore.toFixed(1) : '5.0'} / 5.0</p>
                </div>
              </div>

              {/* Escrow Balance Pill */}
              <div className="glass-card px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-2 text-xs">
                <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <div>
                  <p className="text-[10px] text-emerald-300/80 font-mono uppercase">Escrow Balance</p>
                  <p className="font-bold text-emerald-300">{user.escrowCredits} Credits Available</p>
                </div>
              </div>

              {/* Manage Skills Modal Trigger */}
              <button
                onClick={() => setIsSkillModalOpen(true)}
                className="btn-shimmer px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:opacity-95 shadow-md flex items-center gap-1.5"
              >
                <Settings className="w-4 h-4" />
                Manage Skills & Wishlist
              </button>

              {/* Refresh Data */}
              <button
                onClick={fetchData}
                title="Refresh Matches & Sessions"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* User Skills Summary Row */}
          <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-900/80 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Teaching:
              </span>
              {user.skillsOffered && user.skillsOffered.length > 0 ? (
                user.skillsOffered.map((sk, idx) => (
                  <SkillBadge key={idx} skill={sk.skillName} level={sk.level} proofUrl={sk.proofUrl} verified={sk.verified} />
                ))
              ) : (
                <span className="text-slate-500 italic">No skills listed yet</span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-violet-400" /> Wishlist:
              </span>
              {user.skillsNeeded && user.skillsNeeded.length > 0 ? (
                user.skillsNeeded.map((needed, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                    {needed}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic">Wishlist empty</span>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Main Workspace Navigation & Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            
            <button
              onClick={() => setActiveTab('direct')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'direct'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              Direct 1:1 Matches ({matches.directMatches.length})
            </button>

            <button
              onClick={() => setActiveTab('triangular')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'triangular'
                  ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Repeat className="w-4 h-4 text-violet-400" />
              Triangular Swaps ({matches.triangularSwaps?.length || matches.cycles?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'sessions'
                  ? 'bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              Active Sessions ({sessions.length})
            </button>

            <button
              onClick={() => setIsSkillModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              Manage Skills
            </button>

          </div>
        </div>

        {/* TAB 1: DIRECT 1:1 MATCHES */}
        {activeTab === 'direct' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Direct 1:1 Bilateral Match Engine
              </h3>
              <p className="text-xs text-slate-400">
                Peers whose offered skills match your wishlist and vice-versa.
              </p>
            </div>

            {loadingMatches ? (
              <SkeletonLoader type="card" count={3} />
            ) : matches.directMatches.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
                <p className="text-slate-300 font-semibold text-sm">No direct 1:1 matches calculated yet.</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Add more teachable skills or wishlist tags using the "Manage Skills" modal to unlock bilateral matches!
                </p>
                <button
                  onClick={() => setIsSkillModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-emerald-400 hover:border-emerald-500/40"
                >
                  + Manage Skills Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.directMatches.map((m, idx) => (
                  <MatchCard
                    key={idx}
                    match={m}
                    onInitiateSwap={(match) => {
                      setSwapModalMatch(match);
                      setRequestSkillName(match.skillIWant || match.peer.skillsOffered[0]?.skillName || '');
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRIANGULAR SWAPS (DFS CYCLES) */}
        {activeTab === 'triangular' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Repeat className="w-5 h-5 text-violet-400" />
                3-Way Graph Cycle Barter Engine
              </h3>
              <p className="text-xs text-slate-400">
                DFS depth-3 cycle discovery: You teach Peer B ➔ Peer B teaches Peer C ➔ Peer C teaches You!
              </p>
            </div>

            {loadingMatches ? (
              <SkeletonLoader type="card" count={2} />
            ) : (matches.triangularSwaps?.length || 0) === 0 && (matches.cycles?.length || 0) === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
                <p className="text-slate-300 font-semibold text-sm">No 3-party circular barter chains detected right now.</p>
                <p className="text-xs text-slate-500">
                  Triangular matching automatically routes 3-party skill trades when bilateral direct matches are unavailable.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {(matches.triangularSwaps || matches.cycles || []).map((cycle, idx) => (
                  <CycleCard
                    key={idx}
                    cycle={cycle}
                    index={idx}
                    onInitiateCycle={handleInitiateCycle}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACTIVE SESSIONS LEDGER */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                Active Sessions Ledger & Dual Confirmation
              </h3>
              <p className="text-xs text-slate-400">
                Interactive workspace with dual-signature release. Escrow credit transfers when both parties sign completion.
              </p>
            </div>

            {loadingSessions ? (
              <SkeletonLoader type="list" count={3} />
            ) : (
              <SessionLedger
                sessions={sessions}
                currentUser={user}
                onConfirmSession={handleConfirmSession}
              />
            )}
          </div>
        )}

      </main>

      {/* Skill Manager Modal */}
      <SkillManagerModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onRefresh={fetchData}
      />

      {/* Direct Swap Request Modal */}
      {swapModalMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-slate-700 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img src={swapModalMatch.peer.avatar} className="w-10 h-10 rounded-lg bg-slate-800" />
                <div>
                  <h3 className="font-bold text-white text-base">Request Swap with {swapModalMatch.peer.name}</h3>
                  <p className="text-xs text-slate-400">{swapModalMatch.peer.campusName}</p>
                </div>
              </div>
              <button onClick={() => setSwapModalMatch(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSendDirectRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skill You Want to Learn:</label>
                <input
                  type="text"
                  required
                  value={requestSkillName}
                  onChange={(e) => setRequestSkillName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Session Plan / Notes:</label>
                <textarea
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="Hey, let's meet up this week for our skill exchange!"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1 Escrow Credit will be held in protocol until dual signature release.</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSwapModalMatch(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requestLoading}
                  className="btn-shimmer px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95"
                >
                  {requestLoading ? 'Locking Escrow...' : 'Confirm Escrow & Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
