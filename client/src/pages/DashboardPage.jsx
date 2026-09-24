import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SkillBadge from '../components/SkillBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  Zap,
  ShieldCheck,
  Plus,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Repeat,
  Users,
  Award,
  BookOpen,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export default function DashboardPage() {
  const { user, refreshUser, showToast } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'triangular' | 'sessions'
  const [matches, setMatches] = useState({ directMatches: [], triangularSwaps: [] });
  const [sessions, setSessions] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Add Skill Modal
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [newSkillProof, setNewSkillProof] = useState('');
  const [addSkillLoading, setAddSkillLoading] = useState(false);

  // Request Swap Modal
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
        axios.get('/api/users/matches'),
        axios.get('/api/swaps')
      ]);

      if (matchesRes.data.success) {
        setMatches({
          directMatches: matchesRes.data.directMatches || [],
          triangularSwaps: matchesRes.data.triangularSwaps || []
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

  // Handle Add Skill Submit
  const handleAddSkillSubmit = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      showToast('Skill name is required.', 'error');
      return;
    }

    try {
      setAddSkillLoading(true);
      const res = await axios.post('/api/users/skills-offered', {
        skillName: newSkillName.trim(),
        level: newSkillLevel,
        proofUrl: newSkillProof.trim()
      });

      if (res.data.success) {
        showToast(res.data.message, 'success');
        setShowAddSkillModal(false);
        setNewSkillName('');
        setNewSkillProof('');
        await refreshUser();
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add skill.', 'error');
    } finally {
      setAddSkillLoading(false);
    }
  };

  // Handle Dual Confirmation Signature
  const handleConfirmSession = async (sessionId) => {
    try {
      const res = await axios.put(`/api/swaps/${sessionId}/confirm`);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        await refreshUser();
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to confirm session.', 'error');
    }
  };

  // Handle Send Direct Swap Request
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
        showToast('🎉 Session requested! 1 Escrow Credit held in protocol.', 'success');
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-grid-pattern pb-20">
      
      {/* Top Banner & User Summary */}
      <section className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* User Badge */}
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
                    Verified Peer
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span>{user.email}</span>
                  <span>•</span>
                  <span>{user.campusName || 'MIT Campus'}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Reputation Aggregate */}
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

              {/* Quick Action: Add Skill */}
              <button
                onClick={() => setShowAddSkillModal(true)}
                className="btn-shimmer px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95 shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                List Skill to Teach
              </button>

            </div>

          </div>

          {/* User Skills Summary Row */}
          <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-900/80 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-slate-400 font-bold uppercase">Teaching:</span>
              {user.skillsOffered && user.skillsOffered.length > 0 ? (
                user.skillsOffered.map((sk, idx) => (
                  <SkillBadge key={idx} skill={sk.skillName} level={sk.level} proofUrl={sk.proofUrl} verified={sk.verified} />
                ))
              ) : (
                <span className="text-slate-500 italic">No skills listed yet</span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-slate-400 font-bold uppercase">Wishlist:</span>
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

      {/* Main Dashboard Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('direct')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'direct'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40'
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
                  ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Repeat className="w-4 h-4 text-violet-400" />
              Triangular Swaps ({matches.triangularSwaps.length})
            </button>

            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'sessions'
                  ? 'bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              Sessions Ledger ({sessions.length})
            </button>
          </div>
        </div>

        {/* TAB 1: DIRECT 1:1 MATCHES */}
        {activeTab === 'direct' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Bilateral 1:1 Match Engine
                </h3>
                <p className="text-xs text-slate-400">
                  Campus peers whose offered skills align with your wishlist, and vice-versa.
                </p>
              </div>
            </div>

            {loadingMatches ? (
              <SkeletonLoader type="card" count={3} />
            ) : matches.directMatches.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
                <p className="text-slate-300 font-semibold text-sm">No direct 1:1 matches calculated yet.</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adding more skills to your "What You Teach" or "Wishlist" to unlock bilateral matches!
                </p>
                <button
                  onClick={() => setShowAddSkillModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-emerald-400 hover:border-emerald-500/40"
                >
                  + Add Skills Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.directMatches.map((m, idx) => (
                  <div
                    key={idx}
                    className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-5"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={m.peer.avatar} className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700" />
                        <div>
                          <h4 className="font-bold text-white text-base">{m.peer.name}</h4>
                          <p className="text-xs text-slate-400 font-mono">{m.peer.campusName}</p>
                        </div>
                      </div>

                      <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                        {m.matchScore}% Match
                      </div>
                    </div>

                    {/* Exchange Diagram */}
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-semibold text-slate-400">You Teach:</span>
                        <span className="font-bold text-emerald-400">{m.skillITeach || 'General Skills'}</span>
                      </div>
                      <div className="border-t border-slate-800/80 my-1" />
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-semibold text-slate-400">They Teach You:</span>
                        <span className="font-bold text-violet-400">{m.skillIWant || m.peer.skillsOffered[0]?.skillName}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSwapModalMatch(m);
                        setRequestSkillName(m.skillIWant || m.peer.skillsOffered[0]?.skillName || '');
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                      Request 1:1 Skill Exchange
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRIANGULAR SWAP OPPORTUNITIES */}
        {activeTab === 'triangular' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Repeat className="w-5 h-5 text-violet-400" />
                Triangular 3-Way Exchange Loop
              </h3>
              <p className="text-xs text-slate-400">
                Automated 3-party cycle: You teach Peer B ➔ Peer B teaches Peer C ➔ Peer C teaches You!
              </p>
            </div>

            {loadingMatches ? (
              <SkeletonLoader type="card" count={2} />
            ) : matches.triangularSwaps.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
                <p className="text-slate-300 font-semibold text-sm">No 3-way triangular cycles available right now.</p>
                <p className="text-xs text-slate-500">
                  Triangular matching automatically routes 3-party skill trades when bilateral direct matches are unavailable.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {matches.triangularSwaps.map((tri, idx) => (
                  <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono font-bold">
                          3-Party Protocol Loop #{idx + 1}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Zero-Cash Escrow Protected</span>
                    </div>

                    {/* Visual 3-Step Loop Diagram */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                      
                      {/* Node 1 */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs font-bold">1</span>
                          <p className="text-xs font-bold text-white">Step 1: You ➔ {tri.userB.name}</p>
                        </div>
                        <p className="text-xs text-slate-400">You teach <span className="text-emerald-400 font-bold">{tri.step1.skill}</span></p>
                      </div>

                      {/* Node 2 */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-400 flex items-center justify-center text-xs font-bold">2</span>
                          <p className="text-xs font-bold text-white">Step 2: {tri.userB.name} ➔ {tri.userC.name}</p>
                        </div>
                        <p className="text-xs text-slate-400">{tri.userB.name} teaches <span className="text-violet-400 font-bold">{tri.step2.skill}</span></p>
                      </div>

                      {/* Node 3 */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center text-xs font-bold">3</span>
                          <p className="text-xs font-bold text-white">Step 3: {tri.userC.name} ➔ You</p>
                        </div>
                        <p className="text-xs text-slate-400">{tri.userC.name} teaches <span className="text-sky-400 font-bold">{tri.step3.skill}</span> to You</p>
                      </div>

                    </div>

                    <button
                      onClick={() => {
                        showToast(`Triangular loop session requested with ${tri.userB.name} & ${tri.userC.name}!`, 'success');
                      }}
                      className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      Initiate 3-Party Triangular Swap
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: UPCOMING & ACTIVE SESSIONS LEDGER */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                Skill Swap Sessions Ledger & Dual Confirmation
              </h3>
              <p className="text-xs text-slate-400">
                Track active sessions. When both mentor and learner sign, escrow credits transfer automatically.
              </p>
            </div>

            {loadingSessions ? (
              <SkeletonLoader type="list" count={4} />
            ) : sessions.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
                <p className="text-slate-300 font-semibold text-sm">No active or pending sessions found.</p>
                <p className="text-xs text-slate-500">Request a swap from the Direct Matches tab or Skill Explorer!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((sess) => {
                  const isMentor = sess.mentorId?._id === user._id || sess.mentorId === user._id;
                  const peer = isMentor ? sess.learnerId : sess.mentorId;
                  const mySigned = isMentor ? sess.dualConfirmation?.mentorSigned : sess.dualConfirmation?.learnerSigned;
                  const peerSigned = isMentor ? sess.dualConfirmation?.learnerSigned : sess.dualConfirmation?.mentorSigned;

                  return (
                    <div
                      key={sess._id}
                      className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      
                      {/* Left info */}
                      <div className="flex items-center gap-4">
                        <img
                          src={peer?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=peer'}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-base">{sess.skillName}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${
                              sess.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                : sess.status === 'active'
                                ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}>
                              {sess.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400">
                            Role: <span className="font-bold text-slate-200">{isMentor ? 'Mentor (Teaching)' : 'Learner (Studying)'}</span> with{' '}
                            <span className="text-white font-semibold">{peer?.name || 'Campus Peer'}</span>
                          </p>

                          <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(sess.sessionTime).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Right Dual confirmation status & button */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                        
                        {/* Status Signatures indicator */}
                        <div className="text-right text-[11px] font-mono space-y-0.5">
                          <div className="flex items-center justify-end gap-1">
                            <span>Your Signature:</span>
                            {mySigned ? (
                              <span className="text-emerald-400 font-bold">✓ Signed</span>
                            ) : (
                              <span className="text-amber-400 font-bold">Pending</span>
                            )}
                          </div>
                          <div className="flex items-center justify-end gap-1">
                            <span>Peer Signature:</span>
                            {peerSigned ? (
                              <span className="text-emerald-400 font-bold">✓ Signed</span>
                            ) : (
                              <span className="text-slate-500">Awaiting</span>
                            )}
                          </div>
                        </div>

                        {/* Sign Button */}
                        {sess.status !== 'completed' && (
                          <button
                            onClick={() => handleConfirmSession(sess._id)}
                            disabled={mySigned}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              mySigned
                                ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                                : 'btn-shimmer bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:opacity-95 shadow-md'
                            }`}
                          >
                            <UserCheck className="w-4 h-4" />
                            {mySigned ? 'Signed (Waiting Peer)' : 'Mark Session Completed'}
                          </button>
                        )}

                        {sess.status === 'completed' && (
                          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Escrow Released ⚡
                          </div>
                        )}

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Quick Action Modal: Add Skill */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-slate-700 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                List New Skill to Teach
              </h3>
              <button onClick={() => setShowAddSkillModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSkillSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 14, PyTorch, Figma Systems"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proficiency Level</label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proof URL (GitHub / Portfolio / Cert)</label>
                <input
                  type="url"
                  placeholder="https://github.com/yourusername/project"
                  value={newSkillProof}
                  onChange={(e) => setNewSkillProof(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addSkillLoading}
                  className="btn-shimmer px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95"
                >
                  {addSkillLoading ? 'Adding...' : 'Publish Teachable Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Session Plan / Message:</label>
                <textarea
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="Hey, let's meet up this week for our exchange!"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1 Escrow Credit will be held until dual signature release.</span>
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
                  {requestLoading ? 'Requesting...' : 'Confirm Escrow & Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
