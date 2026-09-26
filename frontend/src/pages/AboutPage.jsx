import React from 'react';
import ConstellationField from '../components/ConstellationField';
import {
  Sparkles,
  ShieldCheck,
  Globe,
  Award,
  Zap,
  ArrowRight,
  RefreshCw,
  Lock,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen transition-colors duration-200 dark:bg-[#04060A] bg-[#f8fafc] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-400/20 selection:text-amber-500 dark:selection:text-amber-200 px-4 sm:px-6 lg:px-8 py-10">
      <ConstellationField />

      <div className="relative z-10 max-w-5xl mx-auto space-y-16">
        
        {/* Header / Mission Statement */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 dark:border-amber-400/20 bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-200 text-xs font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold dark:text-white text-slate-900 tracking-tight font-sans">
            Democratizing Campus Education Through Barter
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-sans">
            SkillMesh is an open, decentralized barter protocol designed to eliminate financial barriers in student learning. By trading expertise directly, students gain hands-on mastery in advanced fields—from AI to Design—without spending a single dollar.
          </p>
        </div>

        {/* Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm hover:border-amber-500/30 rounded-2xl p-6 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 text-amber-700 dark:text-amber-200 w-fit">
              <Globe className="w-5 h-5 text-amber-600 dark:text-amber-300" />
            </div>
            <h3 className="text-base font-semibold dark:text-white text-slate-900 font-sans">Global Campus Network</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Connect students across universities worldwide into a unified peer-to-peer barter economy.
            </p>
          </div>

          <div className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm hover:border-amber-500/30 rounded-2xl p-6 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 text-amber-700 dark:text-amber-200 w-fit">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-300" />
            </div>
            <h3 className="text-base font-semibold dark:text-white text-slate-900 font-sans">Dual-Signature Escrow</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Credits are locked in escrow and released only when both mentor and learner confirm completion.
            </p>
          </div>

          <div className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm hover:border-amber-500/30 rounded-2xl p-6 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 text-amber-700 dark:text-amber-200 w-fit">
              <Award className="w-5 h-5 text-amber-600 dark:text-amber-300" />
            </div>
            <h3 className="text-base font-semibold dark:text-white text-slate-900 font-sans">Proof of Competency</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Mentors showcase verified GitHub, Figma, or Kaggle proofs to build verifiable reputation scores.
            </p>
          </div>
        </div>

        {/* Visual Architecture Diagram Section */}
        <div className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm rounded-3xl p-8 sm:p-10 space-y-8 backdrop-blur-xl">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-mono text-amber-600 dark:text-amber-300 uppercase tracking-wider font-semibold">SYSTEM ARCHITECTURE</span>
            <h2 className="text-2xl font-semibold dark:text-white text-slate-900 font-sans">
              Cycle Detection Engine & Credit Escrow Flow
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              How our graph algorithm pairs students and locks credits in dual-signature escrow.
            </p>
          </div>

          {/* Interactive Visual Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Stage 1: Peer Discovery & Graph Input */}
            <div className="p-6 rounded-2xl dark:bg-[#020306] bg-slate-50 border dark:border-white/10 border-slate-200 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">STAGE 01</span>
                <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-300" />
              </div>
              <h4 className="text-sm font-semibold dark:text-white text-slate-900 font-sans">Graph Network Input</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                User skill profiles are ingested as nodes ($V$) and skill desires as directed edges ($E$) in the campus barter graph.
              </p>
              <div className="p-3 rounded-xl dark:bg-white/[0.03] bg-white border dark:border-white/10 border-slate-200 text-[11px] font-mono text-amber-800 dark:text-amber-200/90 shadow-sm">
                Nodes: [Alex, Sophia, Marcus]
              </div>
            </div>

            {/* Stage 2: Cycle Detection Algorithm */}
            <div className="p-6 rounded-2xl dark:bg-[#020306] bg-slate-50 border border-amber-500/30 dark:border-amber-400/30 space-y-4 relative shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-600 dark:text-amber-300 font-bold">STAGE 02</span>
                <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-300 animate-spin" />
              </div>
              <h4 className="text-sm font-semibold dark:text-white text-slate-900 font-sans">Cycle Detection Engine</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Depth-First Search (DFS) resolves 3-party closed loops: <br />
                <span className="text-amber-700 dark:text-amber-200 font-mono text-[11px]">$Alex \to Sophia \to Marcus \to Alex$</span>
              </p>
              <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 text-[11px] font-mono text-amber-800 dark:text-amber-200 font-semibold">
                Zero Net Cash • 100% Barter
              </div>
            </div>

            {/* Stage 3: Dual Escrow Lock & Signature */}
            <div className="p-6 rounded-2xl dark:bg-[#020306] bg-slate-50 border dark:border-white/10 border-slate-200 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">STAGE 03</span>
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-300" />
              </div>
              <h4 className="text-sm font-semibold dark:text-white text-slate-900 font-sans">Dual Signature Release</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                1 Credit is locked. Learner & Mentor sign upon completion to execute atomic credit transfer.
              </p>
              <div className="p-3 rounded-xl dark:bg-white/[0.03] bg-white border dark:border-white/10 border-slate-200 text-[11px] font-mono text-slate-700 dark:text-slate-300 shadow-sm">
                Signatures: Mentor ✓ Learner ✓
              </div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl dark:bg-white dark:text-black bg-slate-900 text-white font-medium hover:opacity-90 text-xs transition-colors shadow-sm font-sans"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Join the SkillMesh Protocol</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
