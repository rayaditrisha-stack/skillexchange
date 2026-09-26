import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Repeat, Activity, Lock, Cpu, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t transition-colors duration-200 dark:bg-[#040507] bg-[#F7F7F8] dark:border-white/[0.07] border-black/[0.08] text-slate-600 dark:text-slate-400 pt-12 pb-8 font-sans relative z-10 overflow-hidden">
      {/* Ambient Glow Accent */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 space-y-10 relative z-10">
        
        {/* Top Telemetry Strip (Terminal Style) */}
        <div className="p-3.5 rounded-2xl dark:bg-black/40 bg-white/70 border dark:border-white/[0.07] border-black/[0.08] backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono tracking-[0.18em] uppercase text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">SYSTEM TELEMETRY: PROTOCOL ONLINE</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-amber-500" /> LATENCY: 24MS</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-amber-500" /> CONSENSUS: DUAL-ESCROW</span>
            <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3 text-amber-500" /> NODES: CAMPUS ALPHA</span>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 fill-amber-500/20" />
              </div>
              <span className="text-sm font-extrabold tracking-widest text-slate-900 dark:text-white uppercase font-sans">
                SKILLMESH
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Decentralized peer-to-peer barter protocol eliminating tuition barriers through algorithmic graph loop matching & dual-escrow guarantees.
            </p>
            <div className="text-[10px] font-mono tracking-widest text-amber-600 dark:text-amber-400 uppercase">
              [KAGE DESIGN SYSTEM • 2026]
            </div>
          </div>

          {/* Column 2: Protocol */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-900 dark:text-white font-bold">Protocol</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li><Link to="/explore" className="hover:text-amber-500 dark:hover:text-amber-300 transition-colors">Skill Marketplace</Link></li>
              <li><Link to="/how-it-works" className="hover:text-amber-500 dark:hover:text-amber-300 transition-colors">Graph Cycle Engine</Link></li>
              <li><Link to="/dashboard" className="hover:text-amber-500 dark:hover:text-amber-300 transition-colors">Dual Escrow Ledger</Link></li>
              <li><a href="#telemetry" className="hover:text-amber-500 dark:hover:text-amber-300 transition-colors">Proof Verification</a></li>
            </ul>
          </div>

          {/* Column 3: Architecture */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-900 dark:text-white font-bold">Architecture</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li><Link to="/about" className="hover:text-amber-500 dark:hover:text-amber-300 transition-colors">MERN Stack Core</Link></li>
              <li><a href="#cycle-detection" className="hover:text-amber-500 dark:hover:text-amber-300 transition-colors">3-Way Loop Algorithm</a></li>
              <li><a href="#atomic-escrow" className="hover:text-amber-500 dark:hover:text-amber-300 transition-colors">Atomic Escrow Vault</a></li>
              <li><a href="#campus-nodes" className="hover:text-amber-500 dark:hover:text-amber-300 transition-colors">Campus Federation</a></li>
            </ul>
          </div>

          {/* Column 4: Community & Support */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-900 dark:text-white font-bold">Community</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li><Link to="/contact" className="hover:text-amber-500 dark:hover:text-amber-300 transition-colors">Contact Protocol Team</Link></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-amber-500 dark:hover:text-amber-300 transition-colors">GitHub Repository</a></li>
              <li><a href="#discord" className="hover:text-amber-500 dark:hover:text-amber-300 transition-colors">Campus Node Discord</a></li>
              <li><a href="#docs" className="hover:text-amber-500 dark:hover:text-amber-300 transition-colors">API Documentation</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-500">
          <div>© 2026 SkillMesh Barter Protocol. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#security" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Security Disclosure</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
