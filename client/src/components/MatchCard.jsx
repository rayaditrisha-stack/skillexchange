import React from 'react';
import { Zap, ShieldCheck, ArrowRight, Sparkles, User } from 'lucide-react';
import SkillBadge from './SkillBadge';

export default function MatchCard({ match, onInitiateSwap }) {
  const { peer, skillITeach, skillIWant, matchScore, isBilateral } = match;

  return (
    <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-5 shadow-lg">
      
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={peer.avatar}
            alt={peer.name}
            className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700 shadow-sm"
          />
          <div>
            <h4 className="font-bold text-white text-base leading-snug flex items-center gap-1.5">
              {peer.name}
              <ShieldCheck className="w-4 h-4 text-emerald-400" title="Campus Verified Peer" />
            </h4>
            <p className="text-xs text-slate-400 font-mono">{peer.campusName || 'Campus Node'}</p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
          matchScore === 100
            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            : 'bg-violet-500/10 text-violet-300 border-violet-500/30'
        }`}>
          {matchScore}% Match
        </div>
      </div>

      {/* Skills Exchange Trade Box */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-400">You Teach Them:</span>
          <span className="font-bold text-emerald-400">{skillITeach || 'Teachable Skill'}</span>
        </div>
        <div className="border-t border-slate-800/80 my-1" />
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-400">They Teach You:</span>
          <span className="font-bold text-violet-400">{skillIWant || peer.skillsOffered[0]?.skillName}</span>
        </div>
      </div>

      {/* Peer Teachable Skills Pills */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          Peer Skills Offered:
        </p>
        <div className="flex flex-wrap gap-1">
          {peer.skillsOffered?.map((sk, idx) => (
            <SkillBadge key={idx} skill={sk.skillName} level={sk.level} proofUrl={sk.proofUrl} verified={sk.verified} showProof={false} />
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onInitiateSwap(match)}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 group shadow-sm"
      >
        <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 group-hover:scale-110 transition-transform" />
        Initiate 1:1 Skill Exchange
      </button>

    </div>
  );
}
