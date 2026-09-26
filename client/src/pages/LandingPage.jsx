import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NetworkGraphField from '../components/NetworkGraphField';
import {
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Award,
  Repeat,
  Check,
  GitBranch,
  ShieldCheck,
  Zap,
  Code2,
  BookOpen,
  Terminal,
  Activity,
  Cpu,
  Layers
} from 'lucide-react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FigmaIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
  </svg>
);

export default function LandingPage() {
  const [stats] = useState({
    totalSwaps: 1420,
    skillsCataloged: 385,
    escrowVolume: 890
  });

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-[#040507] bg-[#F7F7F8] text-slate-900 dark:text-slate-100 relative overflow-hidden font-sans selection:bg-amber-500/20 selection:text-amber-500">
      {/* Network Background Field */}
      <NetworkGraphField />

      {/* Vignette Background Mask */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(245,158,11,0.06),rgba(4,5,7,0.96))] bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(245,158,11,0.1),rgba(247,247,248,0.94))] pointer-events-none transition-colors duration-300" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* HERO SECTION */}
        <section className="relative z-10 pt-20 pb-16 px-6 max-w-6xl mx-auto text-center flex flex-col items-center">
          
          {/* Micro Telemetry Badge */}
          <div className="border border-amber-500/30 dark:border-amber-400/20 bg-amber-500/10 dark:bg-amber-400/5 text-amber-800 dark:text-amber-300 rounded-full px-4 py-1.5 text-[11px] backdrop-blur-md inline-flex items-center gap-2 mb-8 tracking-[0.18em] font-mono uppercase shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>CAMPUS PEER-TO-PEER BARTER PROTOCOL</span>
          </div>

          {/* Editorial Headline with Kage Serif Accent */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1] max-w-5xl">
            Trade Skills Across Campus.{' '}
            <span className="font-serif italic font-normal text-amber-600 dark:text-amber-300 block sm:inline mt-1 sm:mt-0">
              Zero Friction. Pure Trust.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mt-6 leading-relaxed font-normal">
            SkillMesh replaces fiat currency with algorithmic time-banking and 3-way circular exchange loops. Learn React from a senior while teaching ML to a sophomore.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold text-xs uppercase tracking-wider font-mono hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl flex items-center justify-center gap-2.5 group"
            >
              <span>Initiate Skill Swap</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#cycle-engine"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border dark:border-white/10 border-black/10 bg-white/70 dark:bg-white/[0.03] text-slate-800 dark:text-slate-200 font-semibold text-xs uppercase tracking-wider font-mono hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all backdrop-blur-md flex items-center justify-center gap-2 shadow-sm"
            >
              <GitBranch className="w-4 h-4 text-amber-500" />
              <span>Explore 3-Way Chains</span>
            </a>
          </div>

          {/* 3D DYNAMIC SHOWCASE ISOMETRIC DECK */}
          <div className="mt-16 relative w-full max-w-5xl mx-auto py-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 blur-3xl pointer-events-none rounded-full" />

            {/* perspective Stage */}
            <div className="relative z-10 [perspective:1000px] w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-center justify-items-center">

                {/* CARD 1: 3D Holographic Academic Book */}
                <div className="bg-white/80 dark:bg-[#08090C]/80 backdrop-blur-xl border dark:border-white/[0.07] border-black/[0.08] shadow-2xl p-6 rounded-3xl w-full max-w-xs text-left relative overflow-hidden [transform:rotateY(-6deg)_rotateX(4deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)] transition-all duration-700 ease-out group">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b dark:border-white/[0.07] border-black/[0.08]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-amber-500/20 bg-amber-500/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white font-sans">Theory & Mastery</span>
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-amber-600 dark:text-amber-300 uppercase px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/5">
                      Holographic
                    </span>
                  </div>

                  <div className="bg-slate-100 dark:bg-black/40 rounded-2xl p-4 border dark:border-white/[0.05] border-black/[0.05] space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="font-serif italic text-amber-700 dark:text-amber-200 text-sm">System Design & Algorithms</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                      Peer-to-peer deep dives into data structures, concurrent state models, and scalable backend architecture.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white dark:bg-white/5 border dark:border-white/10 border-slate-300 text-slate-700 dark:text-slate-300">
                        Algorithms
                      </span>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white dark:bg-white/5 border dark:border-white/10 border-slate-300 text-slate-700 dark:text-slate-300">
                        System Design
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Priya (CS '25)</span>
                    <span className="text-amber-500 font-semibold">Verified Theory</span>
                  </div>
                </div>

                {/* CARD 2 (Center Hero): Live Syntax Swap Workstation */}
                <div className="bg-white/90 dark:bg-[#0A0C10]/90 backdrop-blur-2xl border border-amber-500/30 dark:border-amber-400/20 shadow-[0_0_30px_rgba(245,158,11,0.15)] p-6 rounded-3xl w-full max-w-xs text-center relative z-20 md:-translate-y-3 hover:scale-105 transition-all duration-700 ease-out group">
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b dark:border-white/[0.08] border-black/[0.08]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[9px] font-mono text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                      <Code2 className="w-3 h-3" /> Live Syntax Swap
                    </span>
                  </div>

                  <div className="bg-slate-900 dark:bg-black rounded-2xl p-4 border border-amber-500/20 text-left font-mono text-xs space-y-1.5 shadow-inner">
                    <div className="text-slate-400 text-[9px] flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Terminal className="w-3 h-3 text-amber-400" /> barter_engine.ts
                      </span>
                      <span className="text-amber-400 font-bold">LIVE 1:1</span>
                    </div>
                    <div className="text-amber-200 text-[11px]">
                      <span className="text-slate-400">const</span> swap = <span className="text-amber-300">initiateExchange</span>({'{'}
                    </div>
                    <div className="pl-3 text-[11px] text-slate-300">
                      teach: <span className="text-amber-100 font-semibold">"React.js 19"</span>,
                    </div>
                    <div className="pl-3 text-[11px] text-slate-300">
                      receive: <span className="text-slate-100">"PyTorch ML"</span>,
                    </div>
                    <div className="text-amber-200 text-[11px]">{'}'});</div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[10px] text-slate-700 dark:text-slate-300 font-mono">
                    <span>Alex (MIT CS)</span>
                    <span className="text-amber-500 font-semibold">⚡ +1.0 Credit</span>
                  </div>
                </div>

                {/* CARD 3: 3D Dual-Escrow Vault */}
                <div className="bg-white/80 dark:bg-[#08090C]/80 backdrop-blur-xl border dark:border-white/[0.07] border-black/[0.08] shadow-2xl p-6 rounded-3xl w-full max-w-xs text-left relative overflow-hidden [transform:rotateY(6deg)_rotateX(4deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)] transition-all duration-700 ease-out group">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b dark:border-white/[0.07] border-black/[0.08]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-amber-500/20 bg-amber-500/10 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white font-sans">Dual Escrow Vault</span>
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-amber-600 dark:text-amber-300 uppercase px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/5">
                      Secured
                    </span>
                  </div>

                  <div className="bg-slate-100 dark:bg-black/40 rounded-2xl p-4 border dark:border-white/[0.05] border-black/[0.05] space-y-3 relative text-center">
                    <div className="relative flex items-center justify-center my-1">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white font-sans">Dual-Signature Atomic Lock</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans">Credits locked until both peers sign off upon session completion.</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Marcus (DevOps)</span>
                    <span className="text-amber-500 font-semibold">Zero Cash</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID PROTOCOL ARCHITECTURE */}
        <section id="cycle-engine" className="max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">Protocol Architecture</h2>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
              Designed for Trustless Campus Exchange
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Card 1: 3-Way Chains */}
            <div className="lg:col-span-7 bg-white/80 dark:bg-[#08090C]/80 border dark:border-white/[0.07] border-black/[0.08] hover:border-amber-500/30 transition-all rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center mb-6 text-amber-500">
                  <Repeat className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Algorithmic 3-Way Chains</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-8 font-sans">
                  Solve direct double-coincidence of wants using graph cycle detection algorithms ($A \to B \to C \to A$). Swap skills seamlessly even when two peers don't directly overlap.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-black/40 border dark:border-white/[0.06] border-black/[0.06] rounded-2xl p-5 relative">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 bg-white dark:bg-white/5 border dark:border-white/10 border-slate-200 px-3.5 py-2.5 rounded-xl w-full sm:w-auto">
                    <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono font-bold flex items-center justify-center text-xs">
                      A
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">Alex (CS '25)</div>
                      <div className="text-[10px] text-amber-500 font-mono">Offers React</div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 sm:rotate-0" />

                  <div className="flex items-center gap-3 bg-white dark:bg-white/5 border dark:border-white/10 border-slate-200 px-3.5 py-2.5 rounded-xl w-full sm:w-auto">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold flex items-center justify-center text-xs">
                      B
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">Priya (Design)</div>
                      <div className="text-[10px] text-slate-500 font-mono">Offers Figma</div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 rotate-90 sm:rotate-0" />

                  <div className="flex items-center gap-3 bg-white dark:bg-white/5 border dark:border-white/10 border-slate-200 px-3.5 py-2.5 rounded-xl w-full sm:w-auto">
                    <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono font-bold flex items-center justify-center text-xs">
                      C
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">David (Data)</div>
                      <div className="text-[10px] text-amber-500 font-mono">Offers Python</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t dark:border-white/5 border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> Auto Loop Resolution
                  </span>
                  <span>Cycle Fee: 0 Credits</span>
                </div>
              </div>
            </div>

            {/* Card 2: Time-Escrow Ledger */}
            <div className="lg:col-span-5 bg-white/80 dark:bg-[#08090C]/80 border dark:border-white/[0.07] border-black/[0.08] hover:border-amber-500/30 transition-all rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center mb-6 text-amber-500">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Time-Escrow Ledger</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                  Guaranteed session delivery with automated dual-signature releases. Skill time credits are locked safely until both peers confirm completion.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-black/40 border dark:border-white/[0.06] border-black/[0.06] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">ESCROW LOCK #8942</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-semibold">
                    VERIFIED & RELEASED
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs bg-white dark:bg-white/5 p-2 rounded-xl border dark:border-white/5 border-slate-200">
                    <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-xs">
                      <Check className="w-3.5 h-3.5 text-amber-500" /> Learner Signature
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">0x71a...39f</span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-white dark:bg-white/5 p-2 rounded-xl border dark:border-white/5 border-slate-200">
                    <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-xs">
                      <Check className="w-3.5 h-3.5 text-amber-500" /> Mentor Signature
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">0x42b...81e</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Verified Proof Badges */}
            <div className="lg:col-span-12 bg-white/80 dark:bg-[#08090C]/80 border dark:border-white/[0.07] border-black/[0.08] hover:border-amber-500/30 transition-all rounded-3xl p-8 backdrop-blur-md shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="w-12 h-12 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center mb-6 text-amber-500">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Verified Proof Badges</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
                    Verify skills instantly through actual GitHub repos, Figma portfolios, and peer review badges. Zero fluff, verified proof.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-black/40 border dark:border-white/10 border-slate-200 text-slate-800 dark:text-slate-200 text-xs font-mono">
                    <GithubIcon className="w-4 h-4 text-slate-900 dark:text-white" />
                    <span>github.com/alex/react-core</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-500 ml-1" />
                  </div>

                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-black/40 border dark:border-white/10 border-slate-200 text-slate-800 dark:text-slate-200 text-xs font-mono">
                    <FigmaIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    <span>figma.com/@priya/design-sys</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-500 ml-1" />
                  </div>

                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-black/40 border dark:border-white/10 border-slate-200 text-slate-800 dark:text-slate-200 text-xs font-mono">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Peer Vouched (12 Sessions)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NUMBERS TICKER SECTION */}
        <section className="mt-auto border-t dark:border-white/[0.07] border-black/[0.08] bg-slate-100/70 dark:bg-[#040507]/70 backdrop-blur-md py-14 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="p-4">
                <div className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-mono mb-2">
                  {stats.totalSwaps.toLocaleString()}+
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-mono font-semibold">Total Swaps Completed</div>
              </div>

              <div className="p-4 border-y sm:border-y-0 sm:border-x dark:border-white/[0.07] border-black/[0.08]">
                <div className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-mono mb-2">
                  {stats.skillsCataloged.toLocaleString()}+
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-mono font-semibold">Skills Cataloged</div>
              </div>

              <div className="p-4">
                <div className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-mono mb-2">
                  {stats.escrowVolume.toLocaleString()} Hrs
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-mono font-semibold">Escrow Volume Handled</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
