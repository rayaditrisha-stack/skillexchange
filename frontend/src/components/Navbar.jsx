import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ChevronDown, LogOut, LayoutDashboard, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#04060A]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-amber-400/10 border border-amber-400/20 text-amber-200 p-2 rounded-xl backdrop-blur-md flex items-center justify-center group-hover:bg-amber-400/20 transition-colors">
              <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200/20" />
            </div>
            <div className="flex items-center">
              <span className="text-base font-semibold tracking-tight text-white font-sans">
                SkillMesh
              </span>
              <span className="ml-2 border border-amber-400/20 bg-amber-400/5 text-amber-200/80 text-[10px] px-2 py-0.5 rounded-full font-mono">
                P2P v1.0
              </span>
            </div>
          </Link>

          {/* Navigation Links (Center) */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-150 ${
                isActive('/') ? 'text-amber-200 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Skill Explorer
            </Link>

            <Link
              to={user ? "/dashboard" : "/login"}
              className={`text-sm font-medium transition-colors duration-150 ${
                isActive('/dashboard') ? 'text-amber-200 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dashboard & Swaps
            </Link>

            <a
              href="/#cycle-engine"
              className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors duration-150"
            >
              Cycle Engine
            </a>
          </div>

          {/* Right Profile & Escrow Pill / Auth State Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Champagne Bronze Glass Escrow Credit Pill */}
                <div className="border border-amber-400/30 bg-amber-400/10 text-amber-200 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                  <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{user.escrowCredits ?? 3} Credits</span>
                </div>

                {/* Minimalist User Profile Button & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-amber-400/20 flex items-center justify-center text-xs font-semibold text-amber-200 font-mono">
                      {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-slate-200">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-[#04060A]/95 backdrop-blur-xl shadow-2xl py-1.5 z-50"
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="px-3.5 py-2 border-b border-white/10">
                        <p className="text-xs font-semibold text-white">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-300" />
                        Dashboard & Swaps
                      </Link>

                      <div className="border-t border-white/10 my-1" />

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-400 hover:text-white px-3 py-1.5 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-slate-950 hover:bg-slate-200 px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                  Join Network
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
