import React, { useState } from 'react';
import ConstellationField from '../components/ConstellationField';
import { Sparkles, Send, Terminal, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-[#FDFBF7] dark:bg-[#060709] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-500">
      <ConstellationField />

      <div className="relative z-10 max-w-xl mx-auto space-y-8">
        
        {/* Editorial Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono tracking-[0.2em] uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMUNICATION TELEMETRY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold dark:text-white text-slate-900 tracking-tight font-sans">
            Contact Protocol Team.{' '}
            <span className="font-serif italic font-normal text-amber-600 dark:text-amber-400">
              Transmit Query.
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto font-sans">
            Have questions about campus node federation, cycle detection algorithms, or partnership proposals? Drop a message directly to our core developers.
          </p>
        </div>

        {/* Terminal Style Contact Card */}
        <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-none space-y-6">
          <div className="flex items-center justify-between border-b dark:border-white/[0.07] border-black/[0.08] pb-3 text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-amber-500 font-bold">
              <Terminal className="w-3.5 h-3.5" /> DISPATCH_TERMINAL_V1
            </span>
            <span>ENCRYPTED CHANNEL</span>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">Transmission Dispatched</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto font-mono">
                Thank you, {formData.name}. Our node operators will respond to {formData.email} within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', message: '' });
                }}
                className="text-xs font-mono text-amber-500 underline uppercase tracking-wider"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                  NAME / CALLSIGN
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alex Chen"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl text-xs dark:bg-black/40 bg-slate-50 border border-black/[0.08] dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                  CAMPUS EMAIL
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex.chen@campus.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl text-xs dark:bg-black/40 bg-slate-50 border border-black/[0.08] dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-bold">
                    MESSAGE / INQUIRY
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">{formData.message.length} / 500</span>
                </div>
                <textarea
                  rows={4}
                  required
                  maxLength={500}
                  placeholder="Describe your inquiry or campus node feedback..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl text-xs dark:bg-black/40 bg-slate-50 border border-black/[0.08] dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm pt-3"
              >
                <Send className="w-3.5 h-3.5 text-amber-500" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
