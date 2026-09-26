import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ChevronDown, LogOut, LayoutDashboard, Zap, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Skills', path: '/explore' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b transition-colors duration-200 border-slate-200 dark:border-white/[0.08] bg-[#f8fafc]/80 dark:bg-[#04060A]/80 text-slate-900 dark:text-slate-100 backdrop-blur-xl font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 text-amber-600 dark:text-amber-200 p-2 rounded-xl backdrop-blur-md flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-200 fill-amber-500/20" />
            </div>
            <div className="flex items-center">
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white font-sans">
                SkillMesh
              </span>
              <span className="ml-2 border border-amber-500/20 dark:border-amber-400/20 bg-amber-500/5 dark:bg-amber-400/5 text-amber-700 dark:text-amber-200/80 text-[10px] px-2 py-0.5 rounded-full font-mono">
                P2P v1.0
              </span>
            </div>
          </Link>

          {/* Navigation Links (Center Desktop) */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-medium transition-colors duration-150 ${
                  isActive(link.path)
                    ? 'text-amber-600 dark:text-amber-200 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions: Theme Toggle, Escrow Credits, Profile/Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-3">
                {/* Dashboard Nav Button */}
                <Link
                  to="/dashboard"
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    isActive('/dashboard')
                      ? 'bg-amber-500/15 dark:bg-amber-400/20 text-amber-700 dark:text-amber-200 border-amber-500/30 dark:border-amber-400/30'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  Dashboard
                </Link>

                {/* Champagne Bronze Glass Escrow Credit Pill */}
                <div className="border border-amber-500/30 dark:border-amber-400/30 bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.15)] font-mono">
                  <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-amber-300 dark:text-amber-300" />
                  <span>{user.escrowCredits ?? 3} Credits</span>
                </div>

                {/* Minimalist User Profile Button & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-900 border border-amber-500/30 dark:border-amber-400/20 flex items-center justify-center text-xs font-semibold text-amber-700 dark:text-amber-200 font-mono">
                      {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden md:inline text-xs font-medium text-slate-800 dark:text-slate-200">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#04060A]/95 backdrop-blur-xl shadow-2xl py-1.5 z-50 transition-colors duration-200"
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="px-3.5 py-2 border-b border-slate-200 dark:border-white/10">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                        Dashboard & Swaps
                      </Link>

                      <div className="border-t border-slate-200 dark:border-white/10 my-1" />

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
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
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-white/[0.08] bg-[#f8fafc] dark:bg-[#04060A] px-4 pt-2 pb-6 space-y-3 transition-colors duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm py-1.5 ${
                isActive(link.path)
                  ? 'text-amber-600 dark:text-amber-200 font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-slate-700 dark:text-slate-300">{user.name}</span>
                  <span className="text-xs text-amber-600 dark:text-amber-300 font-mono">{user.escrowCredits ?? 3} Credits</span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-center py-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-xs font-semibold text-rose-600 dark:text-rose-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
