import React from 'react';
import { Zap, Shield, GitBranch, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950/90 text-slate-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="font-semibold text-slate-200">SkillMesh Decentralized Campus Protocol</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Campus Mesh Nodes Active
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              Escrow Dual Confirmation v1.0
            </span>
          </div>
        </div>

        <div className="border-t border-slate-900/80 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500">
          <p>© 2026 SkillMesh Protocol. Open campus peer exchange engine.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 transition-colors">Campus Domains Supported: .edu, .ac.in, .edu.*</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
