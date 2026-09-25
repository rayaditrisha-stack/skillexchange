import React from 'react';
import { Zap, ShieldCheck, ArrowRight, User } from 'lucide-react';

export default function MatchCard({ match, onInitiateSwap }) {
  const { peer, skillITeach, skillIWant, matchScore } = match;

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] hover:border-amber-400/20 p-6 rounded-2xl flex flex-col justify-between space-y-5 transition-all">
      
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-amber-400/20 text-amber-200 font-bold text-sm flex items-center justify-center font-mono">
            {peer?.name ? peer.name.slice(0, 2).toUpperCase() : 'PE'}
          </div>
          <div>
            <h4 className="font-semibold text-white text-base leading-snug flex items-center gap-1.5 font-sans">
              {peer?.name}
              <ShieldCheck className="w-4 h-4 text-amber-300" title="Campus Verified Peer" />
            </h4>
            <p className="text-xs text-slate-400 font-mono">{peer?.campusName || 'Campus Node'}</p>
          </div>
        </div>

        <div className="border border-amber-400/20 bg-amber-400/5 text-amber-200/90 text-[11px] font-mono px-2.5 py-0.5 rounded-full">
          Mutual Match
        </div>
      </div>

      {/* Skills Offered & Wants */}
      <div className="space-y-3">
        {/* OFFERS */}
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">OFFERS:</div>
          <div className="flex flex-wrap gap-1.5">
            {(peer?.skillsOffered || []).map((sk, idx) => {
              const name = typeof sk === 'string' ? sk : sk.skillName;
              const lvl = typeof sk === 'object' && sk.level ? ` (${sk.level})` : '';
              return (
                <span key={idx} className="border border-white/10 bg-white/5 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
                  {name}{lvl}
                </span>
              );
            })}
          </div>
        </div>

        {/* WANTS */}
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">WANTS:</div>
          <div className="flex flex-wrap gap-1.5">
            {(peer?.skillsNeeded && peer.skillsNeeded.length > 0 ? peer.skillsNeeded : ['Node.js']).map((sk, idx) => {
              const name = typeof sk === 'string' ? sk : sk.skillName || sk;
              return (
                <span key={idx} className="border border-white/10 bg-white/5 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onInitiateSwap(match)}
        className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-semibold text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
      >
        <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
        Initiate Swap
      </button>

    </div>
  );
}
