import React, { useState } from 'react';
import ConstellationField from '../components/ConstellationField';
import {
  Sparkles,
  Repeat,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronDown,
  Layers,
  Lock,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'How does SkillMesh operate with zero monetary fees?',
    a: 'SkillMesh operates on a pure time-credit accounting protocol. 1 hour taught earns 1 Escrow Credit, which can be redeemed with any verified campus mentor for 1 hour of learning.'
  },
  {
    q: 'What happens if two peers do not directly offer what the other wants?',
    a: 'Our algorithmic cycle engine finds circular barter loops ($A \\to B \\to C \\to A$). If Alex teaches Priya, Priya teaches David, and David teaches Alex, all three trades execute simultaneously at net zero cost.'
  },
  {
    q: 'How does Dual-Signature Escrow protect my credits?',
    a: 'When a barter request is accepted, 1 Credit is held safely in escrow. Upon completing the learning session, both the mentor and learner submit a cryptographic signature to release the escrow credit.'
  },
  {
    q: 'Who can join the SkillMesh campus network?',
    a: 'Any verified student, researcher, or faculty member registered on campus node domains can list offered skills and initiate barter requests.'
  }
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-[#FDFBF7] dark:bg-[#060709] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-500">
      <ConstellationField />

      <div className="relative z-10 max-w-5xl mx-auto space-y-16">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono tracking-[0.2em] uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PROTOCOL ARCHITECTURE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold dark:text-white text-slate-900 tracking-tight font-sans">
            How SkillMesh Works.{' '}
            <span className="font-serif italic font-normal text-amber-600 dark:text-amber-400">
              The 3-Step Protocol.
            </span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-sans">
            Discover how our time-bank ledger and graph loop solver enable seamless skill exchanges without tuition fees or financial intermediaries.
          </p>
        </div>

        {/* CHAPTER EDITORIAL CARDS */}
        <div className="space-y-8">
          
          {/* Chapter 01 */}
          <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-none relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-amber-600 dark:text-amber-400 font-bold">
                  CHAPTER 01 • INVENTORY
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-sans">
                  Catalog Skills & Declare Learning Wants
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  List skills you master (e.g. React.js, Figma, ML Pipelines) alongside verified proof badges (GitHub repos, portfolio links). Specify skills you wish to learn from campus peers.
                </p>
              </div>

              <div className="w-full md:w-56 p-4 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/10 border-black/10 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b dark:border-slate-800 pb-1.5">
                  <span>STATUS</span>
                  <span className="text-amber-500 font-bold">CATALOGED</span>
                </div>
                <div className="text-slate-800 dark:text-slate-200 text-xs font-semibold">OFFERS: React 19</div>
                <div className="text-slate-500 text-[11px]">WANTS: PyTorch ML</div>
              </div>
            </div>
          </div>

          {/* Chapter 02 */}
          <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-none relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-amber-600 dark:text-amber-400 font-bold">
                  CHAPTER 02 • ALGORITHM
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-sans">
                  Algorithmic Graph Loop Match ($A \to B \to C \to A$)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  Our cycle engine continuously traverses the campus skill graph. When direct 1:1 match is unavailable, it automatically forms 3-way circular trade loops so all parties get what they want.
                </p>
              </div>

              <div className="w-full md:w-56 p-4 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/10 border-black/10 text-center space-y-2">
                <div className="text-[10px] font-mono text-amber-500 font-bold tracking-widest uppercase">3-WAY BARTER LOOP</div>
                <div className="text-xs font-mono font-semibold dark:text-white text-slate-900">Alex → Priya → David → Alex</div>
                <div className="text-[10px] text-slate-500 font-mono">Net Cost: 0.00 Credits</div>
              </div>
            </div>
          </div>

          {/* Chapter 03 */}
          <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-none relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-amber-600 dark:text-amber-400 font-bold">
                  CHAPTER 03 • CONSENSUS
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-sans">
                  Dual-Signature Credit Release
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  When a swap request is initiated, 1 Escrow Credit is locked safely. Upon completing the peer session, both mentor and learner record signatures to release credit to the mentor.
                </p>
              </div>

              <div className="w-full md:w-56 p-4 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/10 border-black/10 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>ESCROW STATUS</span>
                  <span className="text-amber-500 font-bold">RELEASED</span>
                </div>
                <div className="text-slate-800 dark:text-slate-200 text-[11px]">✔ Learner Signed</div>
                <div className="text-slate-800 dark:text-slate-200 text-[11px]">✔ Mentor Signed</div>
              </div>
            </div>
          </div>

        </div>

        {/* ACCORDION FAQ SECTION */}
        <div className="space-y-6 pt-8">
          <div className="text-center space-y-2">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 font-bold">FREQUENTLY ASKED QUESTIONS</h2>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">Protocol Clarifications</h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl rounded-2xl shadow-sm dark:shadow-none overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-semibold text-sm text-slate-900 dark:text-white font-sans">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-amber-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans border-t dark:border-white/5 border-black/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center pt-8">
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <span>Join Campus Network Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
