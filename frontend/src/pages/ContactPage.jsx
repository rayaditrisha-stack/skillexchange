import React, { useState } from 'react';
import ConstellationField from '../components/ConstellationField';
import { Sparkles, Mail, User, MessageSquare, Send, CheckCircle2, ShieldCheck, Globe } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen transition-colors duration-200 dark:bg-[#04060A] bg-[#f8fafc] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-400/20 selection:text-amber-500 dark:selection:text-amber-200 px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
      <ConstellationField />

      <div className="relative z-10 max-w-2xl w-full space-y-8 dark:bg-white/[0.02] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm p-8 sm:p-10 rounded-2xl backdrop-blur-xl my-6 transition-colors duration-200">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 dark:border-amber-400/20 bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-200 text-xs font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
            <span>Support & Protocol Inquiries</span>
          </div>
          <h1 className="text-3xl font-semibold dark:text-white text-slate-900 tracking-tight font-sans">
            Get in Touch
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Have a question about campus barter, Escrow credits, or integrating your university node? Drop us a message.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 dark:border-amber-400/30 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-amber-600 dark:text-amber-300 mx-auto" />
            <h3 className="text-lg font-semibold dark:text-white text-slate-900 font-sans">Message Dispatched!</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
              Thank you for contacting the SkillMesh Protocol team. We have received your query and will reply via email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 mb-2 font-mono">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 dark:bg-white/5 bg-slate-50 border dark:border-white/10 border-slate-300 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all font-sans text-xs rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 mb-2 font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="alex@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 dark:bg-white/5 bg-slate-50 border dark:border-white/10 border-slate-300 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all font-sans text-xs rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 mb-2 font-mono">
                Message / Query
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help you regarding your campus barter sessions?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 dark:bg-white/5 bg-slate-50 border dark:border-white/10 border-slate-300 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all font-sans text-xs rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl dark:bg-white dark:text-black bg-slate-900 text-white font-medium hover:opacity-90 transition-colors flex items-center justify-center gap-2 shadow-sm font-sans text-xs"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>Send Message</span>
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-200/80 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" /> Response within 24 Hours
          </span>
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> Global Campus Mesh Node
          </span>
        </div>

      </div>
    </div>
  );
}
