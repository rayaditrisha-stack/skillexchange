import React, { useState } from 'react';
import ConstellationField from '../components/ConstellationField';
import {
  Sparkles,
  Search,
  Code2,
  Cpu,
  Palette,
  Cloud,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  User
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
    <div className="relative min-h-screen transition-colors duration-200 dark:bg-[#04060A] bg-[#f8fafc] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-400/20 selection:text-amber-500 dark:selection:text-amber-200 px-4 sm:px-6 lg:px-8 py-10">
      <ConstellationField />

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 dark:border-amber-400/20 bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-200 text-xs font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
            <span>Peer Mentor Registry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold dark:text-white text-slate-900 tracking-tight font-sans">
            Explore Peer Expertise
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Browse campus mentors offering 1:1 barter learning. Initiate a direct swap or join circular barter cycles with zero cash involved.
          </p>
        </div>

        {/* Search Bar + Category Filters */}
        <div className="dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 text-slate-900 dark:text-white backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search mentor name or skill (e.g. React, ML)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 dark:bg-white/5 bg-slate-50 border dark:border-white/10 border-slate-300 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${
                  selectedCategory === cat.id
                    ? 'dark:bg-white dark:text-slate-950 bg-slate-900 text-white font-semibold shadow-md'
                    : 'dark:bg-white/5 bg-slate-100 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mentor Cards Grid */}
        {filteredMentors.length === 0 ? (
          <div className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm rounded-2xl p-12 text-center space-y-3">
            <User className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold dark:text-white text-slate-900">No Mentors Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search filter or category selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm rounded-2xl p-6 hover:border-amber-500/30 transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Header: Name, Campus, Rating */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-amber-500/30 dark:border-amber-400/20 text-amber-700 dark:text-amber-200 font-bold text-sm flex items-center justify-center font-mono">
                        {mentor.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug flex items-center gap-1.5 font-sans">
                          {mentor.name}
                          {mentor.verified && (
                            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-300" title="Verified Campus Mentor" />
                          )}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{mentor.campus}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 text-amber-800 dark:text-amber-200 font-semibold">
                      ★ {mentor.rating}
                    </span>
                  </div>

                  {/* OFFERS Skills */}
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">
                      OFFERS:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.offeredSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="dark:bg-white/5 bg-slate-100 dark:border-white/10 border-slate-300 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded text-[11px] font-mono border"
                        >
                          {sk.name} ({sk.level})
                          {sk.proof && (
                            <span className="text-amber-600 dark:text-amber-300/80 ml-1" title="Verified Proof">
                              <CheckCircle2 className="w-3 h-3 inline" />
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* WANTS Skills */}
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">
                      WANTS:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.neededSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="dark:bg-white/5 bg-slate-100 dark:border-white/10 border-slate-300 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded text-[11px] font-mono border"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Exchange Request Button */}
                <Link
                  to="/register"
                  className="w-full py-2.5 rounded-xl font-medium text-xs dark:bg-white dark:text-black bg-slate-900 text-white hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm mt-4 font-sans"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Exchange Request</span>
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
