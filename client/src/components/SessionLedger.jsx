import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  UserCheck,
  Video,
  CheckSquare,
  Square,
  Star,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export default function SessionLedger({ sessions, currentUser, onConfirmSession }) {
  // Local state for interactive checklists per session
  const [checklists, setChecklists] = useState({
    default: [
      { id: 1, text: 'Review prerequisite repository code & materials', done: true },
      { id: 2, text: '1:1 Live pair coding / concept walkthrough', done: false },
      { id: 3, text: 'Q&A, code review, and project feedback', done: false }
    ]
  });

  // Local state for submitted ratings
  const [ratings, setRatings] = useState({});

  const toggleChecklistItem = (sessionId, itemId) => {
    const list = checklists[sessionId] || [...checklists.default];
    const updated = list.map(item =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    setChecklists({ ...checklists, [sessionId]: updated });
  };

  const handleRatingSubmit = (sessionId, score) => {
    setRatings({ ...ratings, [sessionId]: score });
  };

  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white/[0.02] p-12 text-center rounded-2xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-3">
        <p className="text-slate-300 font-semibold text-sm">No active or pending sessions found.</p>
        <p className="text-xs text-slate-500">Request a swap from Direct Matches or Skill Explorer to populate your ledger!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sessions.map((sess) => {
        const isMentor = sess.mentorId?._id === currentUser._id || sess.mentorId === currentUser._id;
        const peer = isMentor ? sess.learnerId : sess.mentorId;
        const mySigned = isMentor ? sess.dualConfirmation?.mentorSigned : sess.dualConfirmation?.learnerSigned;
        const peerSigned = isMentor ? sess.dualConfirmation?.learnerSigned : sess.dualConfirmation?.mentorSigned;

        const sessionChecklist = checklists[sess._id] || checklists.default;
        const meetLink = `https://meet.jit.si/skillmesh-${sess._id?.substring(0, 8) || 'room'}`;
        const ratingScore = ratings[sess._id] || 5;

        return (
          <div
            key={sess._id}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] p-6 rounded-2xl space-y-6 relative overflow-hidden"
          >
            {/* Header / Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-amber-400/20 text-amber-200 font-bold text-sm flex items-center justify-center font-mono">
                  {peer?.name ? peer.name.slice(0, 2).toUpperCase() : 'PE'}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white text-base">{sess.skillName}</h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                        sess.status === 'completed'
                          ? 'bg-amber-400/10 text-amber-200 border-amber-400/20'
                          : 'bg-white/5 text-slate-300 border-white/10'
                      }`}
                    >
                      {sess.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Role: <span className="font-semibold text-slate-200">{isMentor ? 'Mentor (Teaching)' : 'Learner (Studying)'}</span> with{' '}
                    <span className="text-white font-semibold">{peer?.name || 'Campus Peer'}</span>
                  </p>
                </div>
              </div>

              {/* Date & Meeting link */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#020306] border border-white/10 text-xs text-slate-300 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  {new Date(sess.sessionTime).toLocaleString()}
                </div>

                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-amber-200 hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Video className="w-3.5 h-3.5 text-amber-300" />
                  Jitsi Room
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

            </div>

            {/* Notes & Topic Checklist Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              
              {/* Session Plan & Notes */}
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                  Session Notes:
                </p>
                <div className="p-3.5 rounded-xl bg-[#020306] border border-white/10 text-xs text-slate-300 leading-relaxed">
                  {sess.notes || 'Campus peer exchange session.'}
                </div>
              </div>

              {/* Interactive Checklist */}
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-amber-300" />
                  Interactive Topic Checklist:
                </p>
                <div className="space-y-1.5 p-3 rounded-xl bg-[#020306] border border-white/10 text-xs">
                  {sessionChecklist.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklistItem(sess._id, item.id)}
                      className="w-full flex items-center gap-2 text-left hover:text-slate-100 transition-colors"
                    >
                      {item.done ? (
                        <CheckSquare className="w-4 h-4 text-amber-300 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className={item.done ? 'line-through text-slate-500' : 'text-slate-300'}>
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer: Dual Confirmation Tracker & Signature Release */}
            <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Dual Sign Tracker */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span>Your Signature:</span>
                  {mySigned ? (
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Signed
                    </span>
                  ) : (
                    <span className="text-amber-200 font-bold">Pending</span>
                  )}
                </div>

                <span className="text-slate-700">|</span>

                <div className="flex items-center gap-1.5">
                  <span>Peer Signature:</span>
                  {peerSigned ? (
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Signed
                    </span>
                  ) : (
                    <span className="text-slate-500">Awaiting</span>
                  )}
                </div>
              </div>

              {/* Action / Rating */}
              <div>
                {sess.status !== 'completed' ? (
                  <button
                    onClick={() => onConfirmSession(sess._id)}
                    disabled={mySigned}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                      mySigned
                        ? 'bg-[#020306] text-slate-500 border border-white/10 cursor-not-allowed'
                        : 'bg-white text-slate-950 hover:bg-slate-200 shadow-md'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    {mySigned ? 'Signed (Awaiting Peer Signature)' : 'Mark Session Completed & Sign'}
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      Escrow Released ⚡
                    </div>

                    {/* Post-Completion Rating Submission */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRatingSubmit(sess._id, star)}
                          className={`p-0.5 transition-colors ${
                            star <= ratingScore ? 'text-amber-300' : 'text-slate-700'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}
