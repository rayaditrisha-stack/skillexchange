import React from 'react';
import { ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

export default function SkillBadge({ skill, level, proofUrl, verified, showProof = true }) {
  const getLevelColor = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'advanced':
        return 'bg-amber-400/20 text-amber-200 border-amber-400/40';
      case 'intermediate':
        return 'bg-amber-400/10 text-amber-300 border-amber-400/30';
      case 'beginner':
      default:
        return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-[#020306] border-white/10 text-xs font-medium text-slate-200 transition-all hover:border-amber-400/20">
      <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
      <span className="font-semibold text-slate-100">{skill}</span>

      {level && (
        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider border font-mono ${getLevelColor(level)}`}>
          {level}
        </span>
      )}

      {verified && (
        <span title="Peer Verified Skill" className="inline-flex items-center text-amber-300">
          <ShieldCheck className="w-3.5 h-3.5" />
        </span>
      )}

      {showProof && proofUrl && (
        <a
          href={proofUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View Proof / Portfolio"
          className="text-slate-400 hover:text-amber-200 transition-colors ml-0.5"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}
