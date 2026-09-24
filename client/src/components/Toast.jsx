import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, setToast } = useAuth();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md text-sm font-medium transition-all ${
          isSuccess
            ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300 shadow-emerald-950/40'
            : isError
            ? 'bg-slate-900/90 border-rose-500/40 text-rose-300 shadow-rose-950/40'
            : 'bg-slate-900/90 border-violet-500/40 text-violet-300 shadow-violet-950/40'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
        {isInfo && <Info className="w-5 h-5 text-violet-400 shrink-0" />}

        <span className="flex-1 leading-snug">{toast.message}</span>

        <button
          onClick={() => setToast && setToast(null)}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
