import React from 'react';
import ConstellationField from '../components/ConstellationField';
import {
  Sparkles,
  ShieldCheck,
  Repeat,
  Cpu,
  Layers,
  Zap,
  Globe,
  Award,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-[#FDFBF7] dark:bg-[#060709] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-500">
      <ConstellationField />

      <div className="relative z-10 max-w-5xl mx-auto space-y-16">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono tracking-[0.2em] uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MANIFESTO & ARCHITECTURE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold dark:text-white text-slate-900 tracking-tight font-sans">
            The Campus Barter Manifesto.{' '}
            <span className="font-serif italic font-normal text-amber-600 dark:text-amber-400">
              Democratizing Education.
            </span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-sans">
            Why higher education needs algorithmic time-banking over fiat tuition fees. A trustless protocol built for students, by students.
          </p>
        </div>

        {/* MANIFESTO SECTION */}
        <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-sm dark:shadow-none space-y-6">
          <div className="text-[10px] font-mono tracking-[0.2em] text-amber-600 dark:text-amber-400 uppercase font-bold">THE CORE PHILOSOPHY</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-sans">
            Eliminating Tuition Barriers with Peer Time Credits
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            <p>
              Traditional course enrollment imposes severe financial friction and administrative rigidity. A Computer Science major wanting to master UI/UX design or an Economics student wanting to learn Python ML pipelines shouldn't be gated by expensive tuition add-ons.
            </p>
            <p>
              SkillMesh operates on the principle that knowledge exchange on campus is naturally reciprocal. By quantifying peer teaching time into standardized Escrow Credits backed by graph cycle algorithms, we unlock direct peer barter across academic departments.
            </p>
          </div>
        </div>

        {/* ARCHITECTURE GRID */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 font-bold">TECHNICAL STACK</h2>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">Architectural Guarantees</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl shadow-sm dark:shadow-none space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-sans">MERN Stack Core</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Powered by Node.js, Express, MongoDB, and React 19 for real-time state synchronization across campus nodes.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl shadow-sm dark:shadow-none space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                <Repeat className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-sans">3-Way Graph Engine</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Depth-first search cycle detection algorithm that instantly matches circular barter chains ($A \to B \to C \to A$).
              </p>
            </div>

            <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl shadow-sm dark:shadow-none space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-sans">Dual Escrow Ledger</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Dual-signature completion release logic keeping peer time credits 100% safe from fraud or premature lockup.
              </p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <span>Explore Campus Node</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
