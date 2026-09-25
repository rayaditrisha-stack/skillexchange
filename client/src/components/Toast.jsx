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
    <div className="fixed bottom-6 right-6 z-50 max-w-md">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md text-sm font-medium transition-all ${
          isSuccess
            ? 'bg-[#04060A] border-amber-400/40 text-amber-200 shadow-black/80'
            : isError
            ? 'bg-[#04060A] border-rose-500/40 text-rose-300 shadow-black/80'
            : 'bg-[#04060A] border-white/20 text-slate-200 shadow-black/80'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />}
        {isError && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
        {isInfo && <Info className="w-5 h-5 text-slate-300 shrink-0" />}

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
