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
    if (!requestSkill || !requestSkill.trim()) {
      showToast('Please select or type a skill to learn.', 'error');
      return;
    }

    try {
      setSwapRequestLoading(true);
      const targetSkill = requestSkill.trim();
      const res = await axios.post('/api/swaps', {
        peerId: swapModalPeer._id,
        skillName: targetSkill,
        skillRequested: targetSkill,
        role: 'learner',
        notes: requestNotes || `Hi ${swapModalPeer.name || 'Peer'}, let's swap skills!`
      });

      if (res.data && res.data.success) {
        showToast(`Swap request sent to ${swapModalPeer.name || 'Peer'}! 1 Escrow credit held.`, 'success');
        setSwapModalPeer(null);
        setRequestNotes('');
        setRequestSkill('');
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
      <div className="min-h-screen dark:bg-[#04060A] bg-[#f8fafc] flex items-center justify-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-500 dark:text-amber-300" />
      </div>
    );
  }

  const availableCredits = user.escrowCredits ?? 3;
  const lockedCredits = sessions.filter(
    (s) => s.status === 'pending' || s.status === 'active' || s.status === 'in_progress'
  ).length;

  return (
    <div className="relative min-h-screen transition-colors duration-200 dark:bg-[#04060A] bg-[#f8fafc] text-slate-900 dark:text-slate-100 p-6 md:p-10 font-sans selection:bg-amber-400/20 selection:text-amber-500 dark:selection:text-amber-200 relative overflow-hidden">
      {/* Background Canvas */}
      <ConstellationField />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* HEADER HUD CARD */}
        <div className="dark:bg-white/[0.03] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-200">
          
          {/* User Identity */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-amber-500/30 dark:border-amber-400/20 text-amber-700 dark:text-amber-200 font-bold text-base flex items-center justify-center font-mono shadow-inner">
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold dark:text-white text-slate-900 tracking-tight">{user.name}</h1>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 text-amber-800 dark:text-amber-200 font-semibold">
                  ★ {user.reputationScore ? user.reputationScore.toFixed(1) : '5.0'} Rating
                </span>
              </div>
              <p className="text-xs dark:text-slate-400 text-slate-500 font-mono mt-0.5">
                {user.email} • {user.campusName || 'Main Campus Node'}
              </p>
            </div>
          </div>

          {/* Balances & Action */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Credit & Escrow Badges */}
            <div className="flex items-center gap-2">
              <span className="border border-amber-500/30 dark:border-amber-400/30 bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-amber-300 dark:text-amber-300" />
                Available: {availableCredits}
              </span>
              <span className="dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Escrow Held: {lockedCredits}
              </span>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => setIsSkillModalOpen(true)}
              className="dark:bg-white dark:text-black bg-slate-900 text-white font-medium hover:opacity-90 px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Offer New Skill</span>
            </button>
          </div>
        </div>

        {/* SEGMENTED NAVIGATION TAB SWITCHER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-4">
          <div className="dark:bg-white/[0.03] bg-slate-200/60 p-1 rounded-xl border dark:border-white/10 border-slate-300 transition-colors duration-200 flex gap-1 inline-flex">
            <button
              onClick={() => setActiveTab('direct')}
              className={`px-4 py-2 rounded-lg text-xs transition-colors ${
                activeTab === 'direct'
                  ? 'dark:bg-white dark:text-black bg-slate-900 text-white font-medium shadow-sm font-semibold'
                  : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              Direct 1:1 Matches ({matches.directMatches.length})
            </button>

            <button
              onClick={() => setActiveTab('triangular')}
              className={`px-4 py-2 rounded-lg text-xs transition-colors ${
                activeTab === 'triangular'
                  ? 'dark:bg-white dark:text-black bg-slate-900 text-white font-medium shadow-sm font-semibold'
                  : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              Triangular Barter Chains ({matches.triangularSwaps.length})
            </button>

            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 rounded-lg text-xs transition-colors ${
                activeTab === 'sessions'
                  ? 'dark:bg-white dark:text-black bg-slate-900 text-white font-medium shadow-sm font-semibold'
                  : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              Active Sessions & Escrow ({sessions.length})
            </button>
          </div>

          <button
            onClick={fetchData}
            className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
                  <div key={i} className="h-44 rounded-xl dark:bg-white/[0.02] bg-white border border-slate-200 dark:border-white/[0.08] animate-pulse" />
                ))}
              </div>
            ) : matches.directMatches.length === 0 ? (
              <div className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm rounded-2xl p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold dark:text-white text-slate-900">No Direct Matches Found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Add more skills you teach or learn using "+ Offer New Skill" to expand your match network.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.directMatches.map((match, idx) => (
                  <div
                    key={match._id || idx}
                    className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm rounded-2xl p-6 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Peer Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-900 border border-amber-500/30 dark:border-amber-400/20 text-amber-700 dark:text-amber-200 font-bold text-xs flex items-center justify-center font-mono">
                            {match.name ? match.name.slice(0, 2).toUpperCase() : 'PE'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white text-sm">{match.name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">★ {match.reputationScore || '5.0'} Rating</div>
                          </div>
                        </div>
                        <span className="border border-amber-500/20 dark:border-amber-400/20 bg-amber-500/10 dark:bg-amber-400/5 text-amber-800 dark:text-amber-200/90 text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold">
                          Mutual Match
                        </span>
                      </div>

                      {/* Clean OFFERS & WANTS Sections */}
                      <div className="space-y-3 mb-4">
                        {/* OFFERS Section */}
                        <div>
                          <div className="text-xs font-semibold dark:text-slate-400 text-slate-500 mb-1 font-mono uppercase tracking-wider">OFFERS:</div>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {match.skillsOffered && match.skillsOffered.length > 0 ? (
                              match.skillsOffered.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs rounded-md dark:bg-amber-400/10 bg-amber-50 border border-amber-400/20 text-amber-700 dark:text-amber-300 font-mono font-medium">
                                  {typeof skill === 'object' ? `${skill.skillName}${skill.level ? ` (${skill.level})` : ''}` : skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 font-mono">General Peer Exchange</span>
                            )}
                          </div>
                        </div>

                        {/* WANTS Section */}
                        <div>
                          <div className="text-xs font-semibold dark:text-slate-400 text-slate-500 mb-1 font-mono uppercase tracking-wider">WANTS:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {(match.skillsNeeded && match.skillsNeeded.length > 0 ? match.skillsNeeded : ['Node.js']).map((s, i) => {
                              const name = typeof s === 'string' ? s : s.skillName || s;
                              return (
                                <span key={i} className="dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-300 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md text-xs font-mono">
                                  {name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSwapModalPeer(match);
                        if (match.skillsOffered && match.skillsOffered.length > 0) {
                          const firstSkill = typeof match.skillsOffered[0] === 'object' ? match.skillsOffered[0].skillName : match.skillsOffered[0];
                          setRequestSkill(firstSkill || '');
                        } else {
                          setRequestSkill('');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl font-medium text-xs dark:bg-white dark:text-black bg-slate-900 text-white hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm font-sans"
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
              <div className="h-48 rounded-xl dark:bg-white/[0.02] bg-white border border-slate-200 dark:border-white/[0.08] animate-pulse" />
            ) : matches.triangularSwaps.length === 0 ? (
              <div className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm rounded-2xl p-12 text-center space-y-3">
                <Repeat className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold dark:text-white text-slate-900">No 3-Way Chains Formed</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Our cycle engine continuously searches for circular trade loops ($A \to B \to C \to A$).
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.triangularSwaps.map((chain, idx) => (
                  <div
                    key={idx}
                    className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm rounded-2xl p-5 space-y-4 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-700 dark:text-amber-300 flex items-center gap-1.5 font-semibold">
                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-300" /> 3-Way Exchange Loop #{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded dark:bg-white/5 bg-slate-100 text-slate-700 dark:text-slate-300 border dark:border-white/10 border-slate-200">
                        Zero Net Cost
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Node A */}
                      <div className="p-3.5 rounded-lg dark:bg-[#020306] bg-slate-50 border dark:border-white/10 border-slate-200 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 dark:border-amber-400/30 text-amber-700 dark:text-amber-200 font-bold font-mono flex items-center justify-center text-xs">
                          A
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">{user.name} (You)</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Teaches Peer B</div>
                        </div>
                      </div>

                      {/* Node B */}
                      <div className="p-3.5 rounded-lg dark:bg-[#020306] bg-slate-50 border dark:border-white/10 border-slate-200 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300 font-bold font-mono flex items-center justify-center text-xs">
                          B
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">{chain.userBName || 'Peer B'}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Teaches Peer C</div>
                        </div>
                      </div>

                      {/* Node C */}
                      <div className="p-3.5 rounded-lg dark:bg-[#020306] bg-slate-50 border dark:border-white/10 border-slate-200 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 dark:border-amber-400/30 text-amber-700 dark:text-amber-200 font-bold font-mono flex items-center justify-center text-xs">
                          C
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">{chain.userCName || 'Peer C'}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Teaches You</div>
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
              <div className="h-44 rounded-xl dark:bg-white/[0.02] bg-white border border-slate-200 dark:border-white/[0.08] animate-pulse" />
            ) : sessions.length === 0 ? (
              <div className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm rounded-2xl p-12 text-center space-y-3">
                <Clock className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">No Active Sessions</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
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
                      className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">SESSION #{session._id?.slice(-6)}</span>
                          <span
                            className={`text-[10px] font-mono px-2.5 py-0.5 rounded border ${
                              session.status === 'completed'
                                ? 'bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-200 border-amber-500/20 dark:border-amber-400/20 font-semibold'
                                : 'dark:bg-white/5 bg-slate-100 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                            }`}
                          >
                            {session.status === 'completed' ? 'COMPLETED & RELEASED' : 'ESCROW LOCKED'}
                          </span>
                        </div>

                        <div className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 font-sans">
                          <Code2 className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                          <span>{session.skillName}</span>
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            (Mentor: {mentorName} • Learner: {learnerName})
                          </span>
                        </div>

                        {/* Dual Signature Tracker */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span
                            className={`text-xs font-mono px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                              mentorSigned
                                ? 'bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-200 border-amber-500/30 dark:border-amber-400/30 font-semibold'
                                : 'dark:bg-[#020306] bg-slate-100 text-slate-500 border-slate-300 dark:border-white/10'
                            }`}
                          >
                            {mentorSigned ? <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" /> : '[ ]'} Mentor Confirmed
                          </span>

                          <span
                            className={`text-xs font-mono px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                              learnerSigned
                                ? 'bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-200 border-amber-500/30 dark:border-amber-400/30 font-semibold'
                                : 'dark:bg-[#020306] bg-slate-100 text-slate-500 border-slate-300 dark:border-white/10'
                            }`}
                          >
                            {learnerSigned ? <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" /> : '[ ]'} Learner Confirmed
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {canSign ? (
                        <button
                          onClick={() => handleSignEscrow(session._id)}
                          className="w-full md:w-auto px-5 py-2.5 rounded-xl dark:bg-white dark:text-black bg-slate-900 text-white font-semibold text-xs hover:opacity-90 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Sign & Release Escrow</span>
                        </button>
                      ) : (
                        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-300" /> Signature Logged
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
            <div className="dark:bg-[#04060A] bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-5 relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-600 dark:text-amber-300" /> Offer New Skill
                </h3>
                <button
                  onClick={() => setIsSkillModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSkillSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-mono">Skill Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js, Docker, Web3"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full px-3.5 py-2.5 dark:bg-white/[0.03] bg-slate-50 border dark:border-white/10 border-slate-300 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-mono">Competency Level</label>
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 dark:bg-[#020306] bg-slate-50 border dark:border-white/10 border-slate-300 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400/50"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-mono">Proof Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/your-username"
                    value={newSkillProof}
                    onChange={(e) => setNewSkillProof(e.target.value)}
                    className="w-full px-3.5 py-2.5 dark:bg-white/[0.03] bg-slate-50 border dark:border-white/10 border-slate-300 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSkillModalOpen(false)}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-200 dark:hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingSkillLoading}
                    className="w-2/3 py-2.5 rounded-xl dark:bg-white dark:text-black bg-slate-900 text-white font-semibold text-xs hover:opacity-90"
                  >
                    {addingSkillLoading ? 'Saving...' : 'Add Skill'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: INITIATE SWAP REQUEST WITH FLEXIBLE COMBOBOX & ESCROW TERMS */}
        {swapModalPeer && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="dark:bg-[#04060A] bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-5 relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 dark:text-amber-300 fill-current" /> Initiate Skill Swap
                </h3>
                <button
                  onClick={() => setSwapModalPeer(null)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleInitiateSwapSubmit} className="space-y-4">
                {/* Peer Mentor Badge */}
                <div className="flex items-center justify-between p-3 rounded-xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/10 border-slate-200">
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Peer Mentor</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{swapModalPeer?.name || 'Selected Peer'}</div>
                  </div>
                  <span className="border border-amber-500/20 dark:border-amber-400/20 bg-amber-500/10 dark:bg-amber-400/5 text-amber-800 dark:text-amber-200 text-[11px] font-mono px-2 py-0.5 rounded-full font-semibold">
                    Verified Peer
                  </span>
                </div>

                {/* Combobox / Hybrid Input + Datalist */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    Select or Type Skill to Learn
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      list="skill-suggestions"
                      value={requestSkill}
                      onChange={(e) => setRequestSkill(e.target.value)}
                      placeholder="e.g. React.js, Docker & K8s, Machine Learning"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs border dark:border-white/10 border-slate-300 dark:bg-white/5 bg-slate-50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-sans"
                    />
                    <datalist id="skill-suggestions">
                      {swapModalPeer?.skillsOffered && swapModalPeer.skillsOffered.length > 0 ? (
                        swapModalPeer.skillsOffered.map((s, idx) => (
                          <option key={idx} value={typeof s === 'object' ? s.skillName : s} />
                        ))
                      ) : (
                        <>
                          <option value="React & Frontend Architecture" />
                          <option value="Node.js & Microservices" />
                          <option value="Docker & Kubernetes" />
                          <option value="Machine Learning & Data Pipelines" />
                          <option value="UI/UX Design Systems" />
                        </>
                      )}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-mono">Notes / Message</label>
                  <textarea
                    rows={2}
                    placeholder="Hi! I'd love to swap skills with you..."
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 dark:bg-white/[0.03] bg-slate-50 border dark:border-white/10 border-slate-300 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                {/* Escrow Confirmation Terms Box */}
                <div className="p-3.5 rounded-xl dark:bg-[#020306] bg-amber-50/80 border border-amber-500/30 dark:border-amber-400/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-amber-800 dark:text-amber-200 font-mono text-[11px] font-semibold">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" /> ESCROW TERMS
                    </span>
                    <span>1.0 CREDIT</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside font-sans">
                    <li>1 Time Credit will be locked in Dual-Signature Escrow.</li>
                    <li>Held safely until both Learner & Mentor sign upon completion.</li>
                    <li>Zero monetary fees • 100% Peer Barter Protocol.</li>
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSwapModalPeer(null)}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={swapRequestLoading || !requestSkill.trim()}
                    className="w-2/3 py-2.5 rounded-xl dark:bg-white dark:text-black bg-slate-900 text-white font-semibold text-xs hover:opacity-90 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {swapRequestLoading ? 'Locking Credit...' : 'Confirm & Lock 1 Escrow Credit'}
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
