import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ConstellationField from '../components/ConstellationField';
import {
  Zap,
  ShieldCheck,
  Plus,
  Users,
  Repeat,
  Clock,
  CheckCircle2,
  Check,
  ArrowRight,
  X,
  Sparkles,
  RefreshCw,
  Lock,
  Code2
} from 'lucide-react';

export default function Dashboard() {
  const { user, refreshUser, showToast, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if guest
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'triangular' | 'sessions'
  const [matches, setMatches] = useState({ directMatches: [], triangularSwaps: [] });
  const [sessions, setSessions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modal States
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [newSkillProof, setNewSkillProof] = useState('');
  const [addingSkillLoading, setAddingSkillLoading] = useState(false);

  const [swapModalPeer, setSwapModalPeer] = useState(null);
  const [requestSkill, setRequestSkill] = useState('');
  const [requestNotes, setRequestNotes] = useState('');
  const [swapRequestLoading, setSwapRequestLoading] = useState(false);

  // Fetch Dashboard Data
  const fetchData = async () => {
    if (!user) return;
    try {
      setLoadingData(true);
      const [matchesRes, sessionsRes] = await Promise.all([
        axios.get('/api/matches/all').catch(() => axios.get('/api/matches/direct')),
        axios.get('/api/swaps').catch(() => ({ data: { success: true, sessions: [] } }))
      ]);

      if (matchesRes.data && matchesRes.data.success) {
        setMatches({
          directMatches: matchesRes.data.directMatches || matchesRes.data.matches || [],
          triangularSwaps: matchesRes.data.triangularSwaps || matchesRes.data.cycles || []
        });
      }

      if (sessionsRes.data && sessionsRes.data.success) {
        setSessions(sessionsRes.data.sessions || sessionsRes.data.swaps || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Add Skill Handler
  const handleAddSkillSubmit = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      showToast('Please enter a skill name.', 'error');
      return;
    }

    try {
      setAddingSkillLoading(true);
      const existingSkills = user.skillsOffered || [];
      const updatedSkills = [
        ...existingSkills,
        {
          skillName: newSkillName.trim(),
          level: newSkillLevel,
          proofUrl: newSkillProof.trim()
        }
      ];

      const res = await axios.put('/api/users/profile', {
        skillsOffered: updatedSkills
      });

      if (res.data.success) {
        showToast(`Added "${newSkillName}" to your offered skills!`, 'success');
        await refreshUser();
        setIsSkillModalOpen(false);
        setNewSkillName('');
        setNewSkillProof('');
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add new skill.', 'error');
    } finally {
      setAddingSkillLoading(false);
    }
  };

  // Initiate Swap Handler
  const handleInitiateSwapSubmit = async (e) => {
    e.preventDefault();
    if (!requestSkill) {
      showToast('Please select a skill to swap.', 'error');
      return;
    }

    try {
      setSwapRequestLoading(true);
      const res = await axios.post('/api/swaps', {
        peerId: swapModalPeer._id,
        skillName: requestSkill,
        role: 'learner',
        notes: requestNotes || `Hi ${swapModalPeer.name}, let's swap skills!`
      });

      if (res.data.success) {
        showToast(`Swap request sent to ${swapModalPeer.name}! 1 Escrow credit held.`, 'success');
        setSwapModalPeer(null);
        setRequestNotes('');
        await refreshUser();
        fetchData();
        setActiveTab('sessions');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send swap request.', 'error');
    } finally {
      setSwapRequestLoading(false);
    }
  };

  // Dual Sign Escrow Handler
  const handleSignEscrow = async (sessionId) => {
    try {
      const res = await axios
        .patch(`/api/swaps/${sessionId}/sign`)
        .catch(() => axios.put(`/api/swaps/${sessionId}/confirm`));

      if (res.data.success) {
        showToast(res.data.message || 'Escrow signature recorded!', 'success');
        await refreshUser();
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to sign escrow release.', 'error');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#04060A] flex items-center justify-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-300" />
      </div>
    );
  }

  const availableCredits = user.escrowCredits ?? 3;
  const lockedCredits = sessions.filter(
    (s) => s.status === 'pending' || s.status === 'active' || s.status === 'in_progress'
  ).length;

  return (
    <div className="relative min-h-screen bg-[#04060A] text-slate-100 px-6 py-8 font-sans selection:bg-amber-400/20 selection:text-amber-200">
      {/* Background Canvas */}
      <ConstellationField />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* HEADER HUD CARD */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          
          {/* User Identity */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-amber-400/20 text-amber-200 font-bold text-base flex items-center justify-center font-mono shadow-inner">
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-white tracking-tight">{user.name}</h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-200">
                  ★ {user.reputationScore ? user.reputationScore.toFixed(1) : '5.0'} Rating
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {user.email} • {user.campusName || 'Main Campus Node'}
              </p>
            </div>
          </div>

          {/* Balances & Action */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Champagne Gold Glass Escrow Pill */}
            <div className="flex items-center gap-2">
              <span className="border border-amber-400/30 bg-amber-400/10 text-amber-300 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 shadow-[0_0_12px_rgba(251,191,36,0.1)]">
                <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                Available: {availableCredits}
              </span>
              <span className="border border-white/10 bg-white/5 text-slate-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Escrow Held: {lockedCredits}
              </span>
            </div>

            {/* Quick Action Button - Solid Platinum White */}
            <button
              onClick={() => setIsSkillModalOpen(true)}
              className="bg-white text-slate-950 hover:bg-slate-200 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Offer New Skill</span>
            </button>
          </div>
        </div>

        {/* SEGMENTED NAVIGATION TAB SWITCHER */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="bg-[#020306] p-1 rounded-xl border border-white/10 flex gap-1 inline-flex">
            <button
              onClick={() => setActiveTab('direct')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'direct'
                  ? 'bg-white text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Direct 1:1 Matches ({matches.directMatches.length})
            </button>

            <button
              onClick={() => setActiveTab('triangular')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'triangular'
                  ? 'bg-white text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Triangular Barter Chains ({matches.triangularSwaps.length})
            </button>

            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'sessions'
                  ? 'bg-white text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Sessions & Escrow ({sessions.length})
            </button>
          </div>

          <button
            onClick={fetchData}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* TAB 1: DIRECT MATCHES */}
        {activeTab === 'direct' && (
          <div className="space-y-6">
            {loadingData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-44 rounded-xl bg-white/[0.02] border border-white/[0.08] animate-pulse" />
                ))}
              </div>
            ) : matches.directMatches.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-12 text-center space-y-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-white">No Direct Matches Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Add more skills you teach or learn using "+ Offer New Skill" to expand your match network.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.directMatches.map((peer, idx) => (
                  <div
                    key={peer._id || idx}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-amber-400/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all p-5 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-amber-400/20 text-amber-200 font-bold text-xs flex items-center justify-center font-mono">
                            {peer.name ? peer.name.slice(0, 2).toUpperCase() : 'PE'}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{peer.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">★ {peer.reputationScore || '5.0'} Rating</div>
                          </div>
                        </div>
                        <span className="border border-amber-400/20 bg-amber-400/5 text-amber-200/90 text-[11px] font-mono px-2.5 py-0.5 rounded-full">
                          Mutual Match
                        </span>
                      </div>

                      <div className="space-y-1.5 mb-4">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Offers:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {(peer.skillsOffered || []).map((s, i) => (
                            <span key={i} className="text-xs px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                              {s.skillName || s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSwapModalPeer(peer);
                        if (peer.skillsOffered && peer.skillsOffered.length > 0) {
                          setRequestSkill(peer.skillsOffered[0].skillName || peer.skillsOffered[0]);
                        }
                      }}
                      className="w-full py-2.5 rounded-lg bg-white text-slate-950 hover:bg-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Initiate Swap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRIANGULAR BARTER CHAINS */}
        {activeTab === 'triangular' && (
          <div className="space-y-6">
            {loadingData ? (
              <div className="h-48 rounded-xl bg-white/[0.02] border border-white/[0.08] animate-pulse" />
            ) : matches.triangularSwaps.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-12 text-center space-y-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                <Repeat className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-white">No 3-Way Chains Formed</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Our cycle engine continuously searches for circular trade loops ($A \to B \to C \to A$).
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.triangularSwaps.map((chain, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-amber-400/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> 3-Way Exchange Loop #{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                        Zero Net Cost
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Node A */}
                      <div className="p-3.5 rounded-lg bg-[#020306] border border-white/10 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-200 font-bold font-mono flex items-center justify-center text-xs">
                          A
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{user.name} (You)</div>
                          <div className="text-[10px] text-slate-400 font-mono">Teaches Peer B</div>
                        </div>
                      </div>

                      {/* Node B */}
                      <div className="p-3.5 rounded-lg bg-[#020306] border border-white/10 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold font-mono flex items-center justify-center text-xs">
                          B
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{chain.userBName || 'Peer B'}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Teaches Peer C</div>
                        </div>
                      </div>

                      {/* Node C */}
                      <div className="p-3.5 rounded-lg bg-[#020306] border border-white/10 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-200 font-bold font-mono flex items-center justify-center text-xs">
                          C
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{chain.userCName || 'Peer C'}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Teaches You</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACTIVE SESSIONS & ESCROW LEDGER */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            {loadingData ? (
              <div className="h-44 rounded-xl bg-white/[0.02] border border-white/[0.08] animate-pulse" />
            ) : sessions.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-12 text-center space-y-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                <Clock className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-white">No Active Sessions</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Initiate a swap from Direct Matches to lock escrow and start learning.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => {
                  const isLearner = session.learner?._id === user._id || session.learner === user._id;
                  const mentorName = session.mentor?.name || 'Peer Mentor';
                  const learnerName = session.learner?.name || 'Learner';

                  const mentorSigned = session.mentorConfirmed || session.status === 'completed';
                  const learnerSigned = session.learnerConfirmed || session.status === 'completed';

                  const canSign =
                    session.status !== 'completed' &&
                    ((isLearner && !learnerSigned) || (!isLearner && !mentorSigned));

                  return (
                    <div
                      key={session._id}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-amber-400/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-400">SESSION #{session._id?.slice(-6)}</span>
                          <span
                            className={`text-[10px] font-mono px-2.5 py-0.5 rounded border ${
                              session.status === 'completed'
                                ? 'bg-amber-400/10 text-amber-200 border-amber-400/20'
                                : 'bg-white/5 text-slate-300 border-white/10'
                            }`}
                          >
                            {session.status === 'completed' ? 'COMPLETED & RELEASED' : 'ESCROW LOCKED'}
                          </span>
                        </div>

                        <div className="text-base font-semibold text-white flex items-center gap-2 font-sans">
                          <Code2 className="w-4 h-4 text-amber-300" />
                          <span>{session.skillName}</span>
                          <span className="text-xs font-normal text-slate-400">
                            (Mentor: {mentorName} • Learner: {learnerName})
                          </span>
                        </div>

                        {/* Dual Signature Tracker */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span
                            className={`text-xs font-mono px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                              mentorSigned
                                ? 'bg-amber-400/10 text-amber-200 border-amber-400/30'
                                : 'bg-[#020306] text-slate-500 border-white/10'
                            }`}
                          >
                            {mentorSigned ? <Check className="w-3.5 h-3.5 text-amber-300" /> : '[ ]'} Mentor Confirmed
                          </span>

                          <span
                            className={`text-xs font-mono px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                              learnerSigned
                                ? 'bg-amber-400/10 text-amber-200 border-amber-400/30'
                                : 'bg-[#020306] text-slate-500 border-white/10'
                            }`}
                          >
                            {learnerSigned ? <Check className="w-3.5 h-3.5 text-amber-300" /> : '[ ]'} Learner Confirmed
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {canSign ? (
                        <button
                          onClick={() => handleSignEscrow(session._id)}
                          className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-white text-slate-950 hover:bg-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                        >
                          <ShieldCheck className="w-4 h-4 text-slate-950" />
                          <span>Sign & Release Escrow</span>
                        </button>
                      ) : (
                        <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-amber-300" /> Signature Logged
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MODAL: OFFER NEW SKILL */}
        {isSkillModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#04060A] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-5 relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-300" /> Offer New Skill
                </h3>
                <button
                  onClick={() => setIsSkillModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSkillSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Skill Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js, Docker, Web3"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Competency Level</label>
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#020306] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400/50"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Proof Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/your-username"
                    value={newSkillProof}
                    onChange={(e) => setNewSkillProof(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSkillModalOpen(false)}
                    className="w-1/3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium text-xs hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingSkillLoading}
                    className="w-2/3 py-2.5 rounded-lg bg-white text-slate-950 font-semibold text-xs hover:bg-slate-200"
                  >
                    {addingSkillLoading ? 'Saving...' : 'Add Skill'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: INITIATE SWAP REQUEST */}
        {swapModalPeer && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#04060A] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-5 relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> Initiate Skill Swap
                </h3>
                <button
                  onClick={() => setSwapModalPeer(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleInitiateSwapSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Peer Mentor</label>
                  <div className="text-xs font-semibold text-white">{swapModalPeer.name}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Select Skill to Learn</label>
                  <select
                    value={requestSkill}
                    onChange={(e) => setRequestSkill(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#020306] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400/50"
                  >
                    {(swapModalPeer.skillsOffered || []).map((s, i) => {
                      const name = s.skillName || s;
                      return (
                        <option key={i} value={name}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Notes / Message</label>
                  <textarea
                    rows={3}
                    placeholder="Hi! I'd love to swap skills with you..."
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSwapModalPeer(null)}
                    className="w-1/3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium text-xs hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={swapRequestLoading}
                    className="w-2/3 py-2.5 rounded-lg bg-white text-slate-950 font-semibold text-xs hover:bg-slate-200"
                  >
                    {swapRequestLoading ? 'Sending...' : 'Send Request (1 Credit)'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
