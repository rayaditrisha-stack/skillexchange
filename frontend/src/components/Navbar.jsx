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
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6">
      <nav className="max-w-5xl mx-auto backdrop-blur-xl border dark:border-white/10 border-black/10 dark:bg-black/50 bg-white/80 rounded-full px-5 py-2.5 shadow-2xl transition-all duration-300 flex items-center justify-between font-sans">
        
        {/* Brand Identity: Kage Typographic Badge */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 text-amber-600 dark:text-amber-300 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
            <Sparkles className="w-4 h-4 fill-amber-500/20" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-widest text-slate-900 dark:text-white uppercase font-sans">
              SKILLMESH
            </span>
            <span className="text-[9px] tracking-[0.18em] font-mono text-amber-600 dark:text-amber-400/90 font-semibold px-2 py-0.5 rounded-full border border-amber-500/20 dark:border-amber-400/20 bg-amber-500/5 dark:bg-amber-400/5">
              [v1.0 • KAGE PROTOCOL]
            </span>
          </div>
        </Link>

        {/* Navigation Links (Center Desktop Capsule) */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-xs font-medium transition-colors duration-150 py-1 ${
                  active
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>{link.name}</span>
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Theme Toggle, Escrow Pill, Auth Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                  isActive('/dashboard')
                    ? 'bg-amber-500/15 dark:bg-amber-400/20 text-amber-800 dark:text-amber-200 border-amber-500/30 dark:border-amber-400/30'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                Dashboard
              </Link>

              {/* Escrow Credit Badge */}
              <div className="border border-amber-500/30 dark:border-amber-400/30 bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.15)] font-mono">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-amber-300 dark:text-amber-300" />
                <span>⚡ {user.escrowCredits ?? 3} Credits</span>
              </div>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center font-mono">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-52 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#08090C]/95 backdrop-blur-2xl shadow-2xl py-2 z-50 transition-colors duration-200"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-white/10">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                      Dashboard & Swaps
                    </Link>

                    <div className="border-t border-slate-200 dark:border-white/10 my-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-full px-5 py-2 text-xs font-semibold transition-all shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-5xl mx-auto mt-2 border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#08090C]/95 backdrop-blur-2xl rounded-2xl px-5 py-4 space-y-3 transition-colors duration-200 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-xs py-1.5 ${
                isActive(link.path)
                  ? 'text-amber-600 dark:text-amber-300 font-semibold'
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
                  <span className="text-xs text-amber-600 dark:text-amber-300 font-mono">⚡ {user.escrowCredits ?? 3} Credits</span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-center py-2 rounded-full bg-rose-50 dark:bg-rose-500/10 text-xs font-semibold text-rose-600 dark:text-rose-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
