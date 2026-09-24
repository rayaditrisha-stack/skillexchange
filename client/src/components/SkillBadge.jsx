import React from 'react';
import { ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

export default function SkillBadge({ skill, level, proofUrl, verified, showProof = true }) {
  const getLevelColor = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'advanced':
        return 'bg-violet-500/10 text-violet-300 border-violet-500/30';
      case 'intermediate':
        return 'bg-sky-500/10 text-sky-300 border-sky-500/30';
      case 'beginner':
      default:
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-slate-900/60 border-slate-800 text-xs font-medium text-slate-200 transition-all hover:border-slate-700">
      <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
      <span className="font-semibold text-slate-100">{skill}</span>

      {level && (
        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider border font-mono ${getLevelColor(level)}`}>
          {level}
        </span>
      )}

      {verified && (
        <span title="Peer Verified Skill" className="inline-flex items-center text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
        </span>
      )}

      {showProof && proofUrl && (
        <a
          href={proofUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View Proof / Portfolio"
          className="text-slate-400 hover:text-emerald-400 transition-colors ml-0.5"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}
