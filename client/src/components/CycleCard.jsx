import React from 'react';
import { Repeat, Zap, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function CycleCard({ cycle, index, onInitiateCycle }) {
  const { userB, userC, step1, step2, step3 } = cycle;

  return (
    <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5 text-violet-400" />
            3-Party Circular Cycle #{index + 1}
          </span>
        </div>
        <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Escrow Protected Loop
        </span>
      </div>

      {/* Visual 3-Node Circular Loop Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        
        {/* Step 1 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
              1
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Node A ➔ B</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-white flex items-center gap-1">
              You <ArrowRight className="w-3 h-3 text-slate-400" /> {userB.name}
            </p>
            <p className="text-xs text-slate-400">
              You teach <span className="text-emerald-400 font-bold">{step1.skill}</span>
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-400 flex items-center justify-center text-xs font-bold font-mono">
              2
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Node B ➔ C</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-white flex items-center gap-1">
              {userB.name} <ArrowRight className="w-3 h-3 text-slate-400" /> {userC.name}
            </p>
            <p className="text-xs text-slate-400">
              {userB.name} teaches <span className="text-violet-400 font-bold">{step2.skill}</span>
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center text-xs font-bold font-mono">
              3
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Node C ➔ A</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-white flex items-center gap-1">
              {userC.name} <ArrowRight className="w-3 h-3 text-slate-400" /> You
            </p>
            <p className="text-xs text-slate-400">
              {userC.name} teaches <span className="text-sky-400 font-bold">{step3.skill}</span> to You
            </p>
          </div>
        </div>

      </div>

      {/* Action Button */}
      <button
        onClick={() => onInitiateCycle(cycle)}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
      >
        <Zap className="w-4 h-4 fill-white text-white" />
        Initiate 3-Party Triangular Barter Loop
      </button>

    </div>
  );
}
