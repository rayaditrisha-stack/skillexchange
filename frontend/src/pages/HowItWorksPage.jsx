import React, { useState } from 'react';
import ConstellationField from '../components/ConstellationField';
import {
  Sparkles,
  BookOpen,
  Repeat,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PROCESS_STEPS = [
  {
    number: '01',
    title: '1. List Your Skills & Learning Goals',
    description: 'Catalog the skills you excel at (with competency levels and optional proof links) and declare the skills you wish to learn from campus peers.',
    icon: BookOpen,
    highlight: 'Instant Signup • 3 Free Escrow Credits'
  },
  {
    number: '02',
    title: '2. Smart Match (1:1 & 3-Way Loops)',
    description: 'Our cycle detection algorithm automatically pairs direct mutual matches (A ↔ B) and circular barter loops (A → B → C → A) to unlock matches with zero monetary exchange.',
    icon: Repeat,
    highlight: 'Zero Cash Barter • Cycle Graph Solver'
  },
  {
    number: '03',
    title: '3. Dual-Escrow Credit Release',
    description: 'When a session begins, 1 Time Credit is locked in Dual-Signature Escrow. Upon completion, both mentor and learner sign off to safely release credit to the mentor.',
    icon: ShieldCheck,
    highlight: '100% Peer Verified • Escrow Ledger'
  }
];

const FAQ_ITEMS = [
  {
    question: 'How do Escrow Credits work?',
    answer: 'Every new student receives 3 Time Credits upon registration. When you request a 1:1 swap with a peer mentor, 1 Time Credit is held in Dual-Signature Escrow. The credit remains locked safely until both mentor and learner confirm completion of the session.'
  },
  {
    question: 'What is a 3-Way Circular Barter Loop ($A \\to B \\to C \\to A$)?',
    answer: 'If Peer A wants to learn React from Peer B, but Peer B wants UI/UX (which Peer C teaches), and Peer C wants Node.js (which Peer A teaches), our engine resolves this circular exchange loop so everyone teaches what they know and learns what they want without cash!'
  },
  {
    question: 'Is SkillMesh completely free to use?',
    answer: 'Yes! SkillMesh operates on a 100% peer-to-peer barter protocol. There are zero monetary fees or subscriptions. You earn time credits by mentoring peers and spend them to learn from others.'
  },
  {
    question: 'How are peer competencies verified?',
    answer: 'Peers can upload optional proof links (GitHub repositories, Figma projects, Kaggle notebooks). After each swap session, learners rate their mentor, building a permanent on-chain reputation score.'
  },
  {
    question: 'Can I offer multiple skills at once?',
    answer: 'Absolutely. You can add as many skills as you want under your profile. You can also specify different competency levels (Beginner, Intermediate, Advanced) for each offered skill.'
  }
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen transition-colors duration-200 dark:bg-[#04060A] bg-[#f8fafc] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-400/20 selection:text-amber-500 dark:selection:text-amber-200 px-4 sm:px-6 lg:px-8 py-10">
      <ConstellationField />

      <div className="relative z-10 max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 dark:border-amber-400/20 bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-200 text-xs font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
            <span>Campus Barter Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold dark:text-white text-slate-900 tracking-tight font-sans">
            How SkillMesh Works
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            A three-step peer-to-peer learning protocol powered by smart matching algorithms and dual-signature credit escrow.
          </p>
        </div>

        {/* 3 Clean Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm hover:border-amber-500/30 rounded-2xl p-7 transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10 px-3 py-1 rounded-full border border-amber-500/20 dark:border-amber-400/20">
                      STEP {step.number}
                    </span>
                    <div className="p-2.5 rounded-xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 text-amber-600 dark:text-amber-300">
                      <Icon className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold dark:text-white text-slate-900 font-sans leading-snug">{step.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{step.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/5 text-[11px] font-mono text-amber-800 dark:text-amber-200/90 flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                  <span>{step.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-6 max-w-3xl mx-auto pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold dark:text-white text-slate-900 tracking-tight font-sans">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Everything you need to know about peer matching and escrow terms.</p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-sm dark:text-white text-slate-900 font-sans">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-600 dark:text-amber-300 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans border-t border-slate-200 dark:border-white/5 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm rounded-2xl p-8 text-center space-y-4 backdrop-blur-xl max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold dark:text-white text-slate-900 font-sans">Start Exchanging Skills Today</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Join thousands of students learning React, AI, and Design for free.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl dark:bg-white dark:text-black bg-slate-900 text-white font-medium hover:opacity-90 text-xs transition-colors shadow-sm font-sans"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Create Free Account</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
