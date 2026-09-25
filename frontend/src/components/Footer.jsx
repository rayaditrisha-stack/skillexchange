import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Repeat } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#04060A] py-12 text-xs text-slate-400 font-sans relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-400/10 border border-amber-400/20 text-amber-200 p-2 rounded-xl backdrop-blur-md flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-tight">SkillMesh</span>
              <span className="border border-amber-400/20 bg-amber-400/5 text-amber-200/80 text-[10px] px-2 py-0.5 rounded-full font-mono">
                P2P v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Zero Money • Dual Escrow • Graph Cycle Exchange
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-200/90 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Dual Escrow Vault</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs font-mono">
            <Repeat className="w-3.5 h-3.5 text-amber-300" />
            <span>3-Way Cycle Engine</span>
          </div>
        </div>

        {/* Links & Copyright */}
        <div className="flex items-center gap-6 text-xs text-slate-500 font-mono">
          <span>© 2026 SkillMesh</span>
          <Link to="/" className="hover:text-slate-300 transition-colors">Explorer</Link>
          <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
          <a href="#terms" className="hover:text-slate-300 transition-colors">Terms</a>
        </div>

      </div>
    </footer>
  );
}
