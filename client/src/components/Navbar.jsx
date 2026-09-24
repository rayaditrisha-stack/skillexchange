import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Shield, LogOut, User, LayoutDashboard, Search, ChevronDown, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-violet-600 p-0.5 shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                SkillMesh
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                  P2P
                </span>
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-white bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              Skill Explorer
            </Link>
            
            {user && (
              <Link
                to="/dashboard"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/dashboard') ? 'text-white bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-violet-400" />
                Dashboard & Match Engine
              </Link>
            )}
          </div>

          {/* Auth State Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Escrow Balance Pill */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-inner">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  <span>{user.escrowCredits} Credits</span>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all text-left"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover bg-slate-800 border border-slate-700"
                    />
                    <div className="hidden sm:block">
                      <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{user.campusName || 'Campus Node'}</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="px-3.5 py-2 border-b border-slate-800/80">
                        <p className="text-xs font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-violet-400" />
                        Dashboard & Swaps
                      </Link>

                      <div className="border-t border-slate-800/80 my-1" />

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
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-shimmer px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  Get 3 Free Credits
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
