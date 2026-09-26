import React, { useState } from 'react';
import ConstellationField from '../components/ConstellationField';
import {
  Sparkles,
  Search,
  ShieldCheck,
  Zap,
  CheckCircle2,
  User,
  Command
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'all', label: 'All Fields' },
  { id: 'web', label: 'Web Dev' },
  { id: 'uiux', label: 'UI/UX' },
  { id: 'aiml', label: 'AI/ML' },
  { id: 'cloud', label: 'Cloud' }
];

const MENTOR_CARDS = [
  {
    id: 1,
    name: 'Alex Chen',
    campus: 'MIT - Computer Science',
    category: 'web',
    rating: 4.9,
    offeredSkills: [
      { name: 'React.js 19', level: 'Advanced', proof: 'https://github.com' },
      { name: 'Node.js & Express', level: 'Intermediate', proof: 'https://github.com' }
    ],
    neededSkills: ['Machine Learning', 'UI/UX Design'],
    avatar: 'AC',
    verified: true
  },
  {
    id: 2,
    name: 'Sophia Patel',
    campus: 'Stanford AI Lab',
    category: 'aiml',
    rating: 5.0,
    offeredSkills: [
      { name: 'Machine Learning', level: 'Advanced', proof: 'https://github.com' },
      { name: 'PyTorch Models', level: 'Advanced', proof: 'https://kaggle.com' }
    ],
    neededSkills: ['Docker & K8s', 'React.js'],
    avatar: 'SP',
    verified: true
  },
  {
    id: 3,
    name: 'Elena Rostova',
    campus: 'UC Berkeley Design Inst.',
    category: 'uiux',
    rating: 4.9,
    offeredSkills: [
      { name: 'Figma Design System', level: 'Advanced', proof: 'https://figma.com' },
      { name: 'Tailwind CSS Tokens', level: 'Advanced', proof: 'https://dribbble.com' }
    ],
    neededSkills: ['Node.js & Express', 'Python Data Science'],
    avatar: 'ER',
    verified: true
  },
  {
    id: 4,
    name: 'Marcus Vance',
    campus: 'IIT Bombay DevOps',
    category: 'cloud',
    rating: 4.8,
    offeredSkills: [
      { name: 'Docker & Kubernetes', level: 'Advanced', proof: 'https://github.com' },
      { name: 'Golang Microservices', level: 'Intermediate', proof: 'https://github.com' }
    ],
    neededSkills: ['React.js', 'Machine Learning'],
    avatar: 'MV',
    verified: true
  },
  {
    id: 5,
    name: 'Liam O\'Connor',
    campus: 'University of Oxford',
    category: 'web',
    rating: 4.7,
    offeredSkills: [
      { name: 'TypeScript Engines', level: 'Advanced', proof: 'https://github.com' },
      { name: 'Solidity Contracts', level: 'Intermediate', proof: 'https://etherscan.io' }
    ],
    neededSkills: ['Figma & UI/UX', 'React.js'],
    avatar: 'LO',
    verified: true
  },
  {
    id: 6,
    name: 'Aria Tanaka',
    campus: 'Tokyo Tech AI Node',
    category: 'aiml',
    rating: 4.9,
    offeredSkills: [
      { name: 'Computer Vision', level: 'Advanced', proof: 'https://github.com' },
      { name: 'Python Data Pipelines', level: 'Advanced', proof: 'https://github.com' }
    ],
    neededSkills: ['Cloud Architecture', 'Next.js'],
    avatar: 'AT',
    verified: true
  }
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMentors = MENTOR_CARDS.filter((mentor) => {
    const matchesCategory = selectedCategory === 'all' || mentor.category === selectedCategory;
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.offeredSkills.some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mentor.neededSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-[#FDFBF7] dark:bg-[#060709] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-500">
      <ConstellationField />

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        
        {/* Editorial Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono tracking-[0.2em] uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CURATED SKILL MARKETPLACE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold dark:text-white text-slate-900 tracking-tight font-sans">
            Explore Peer Expertise.{' '}
            <span className="font-serif italic font-normal text-amber-600 dark:text-amber-400">
              Barter Knowledge.
            </span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-sans">
            Browse verified campus mentors offering 1:1 barter learning. Initiate a direct swap or join circular barter cycles with zero monetary fees.
          </p>
        </div>

        {/* Command Palette Search Bar & Category Pills */}
        <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-sm dark:shadow-none space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          
          {/* Command Palette Search Input */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5 text-slate-400 font-mono text-xs">
              <Command className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-bold">K</span>
            </div>
            <input
              type="text"
              placeholder="Search peer skills or campus members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 dark:bg-black/40 bg-slate-50 border border-black/[0.08] dark:border-white/10 rounded-full text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 font-sans transition-all"
            />
          </div>

          {/* Category Filter Pills with Hairline Borders */}
          <div className="flex flex-wrap gap-2 items-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold font-mono tracking-wider transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-sm'
                    : 'border border-black/[0.08] dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-amber-500/50 hover:text-amber-500'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mentor Cards Grid */}
        {filteredMentors.length === 0 ? (
          <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl rounded-2xl p-12 text-center space-y-3 shadow-sm dark:shadow-none">
            <User className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold dark:text-white text-slate-900">No Campus Mentors Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search filter or category selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-none hover:border-amber-500/30 transition-all space-y-5 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Peer Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold text-xs flex items-center justify-center font-mono">
                        {mentor.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug flex items-center gap-1.5 font-sans">
                          {mentor.name}
                          {mentor.verified && (
                            <ShieldCheck className="w-4 h-4 text-amber-500" title="Verified Campus Peer" />
                          )}
                        </h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{mentor.campus}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                      ★ {mentor.rating}
                    </span>
                  </div>

                  {/* OFFERS Skills */}
                  <div>
                    <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-1.5 font-bold">
                      OFFERS:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.offeredSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-medium"
                        >
                          {sk.name} ({sk.level})
                          {sk.proof && (
                            <span className="text-amber-500 ml-1" title="Verified Proof">
                              <CheckCircle2 className="w-3 h-3 inline" />
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* WANTS Skills */}
                  <div>
                    <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-1.5 font-bold">
                      WANTS:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.neededSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-black/10 text-slate-800 dark:text-slate-300 px-2.5 py-0.5 rounded-lg text-[11px] font-mono"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Exchange Request Action Button */}
                <Link
                  to="/register"
                  className="w-full py-2.5 rounded-full font-semibold text-xs bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm mt-4 font-mono uppercase tracking-wider"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>Initiate Barter</span>
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
