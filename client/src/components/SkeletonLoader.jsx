import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 3 }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((_, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 animate-skeleton">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800/60 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-slate-800 rounded w-1/3" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-slate-800 rounded-md" />
                <div className="h-6 w-24 bg-slate-800 rounded-md" />
              </div>
            </div>
            <div className="h-10 bg-slate-800 rounded-xl w-full pt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {items.map((_, i) => (
          <div key={i} className="glass-card p-4 rounded-xl border border-slate-800 flex items-center justify-between animate-skeleton">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800" />
              <div className="space-y-1">
                <div className="h-4 bg-slate-800 rounded w-32" />
                <div className="h-3 bg-slate-800/60 rounded w-24" />
              </div>
            </div>
            <div className="h-8 w-24 bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-32 bg-slate-800/50 rounded-2xl animate-skeleton" />
  );
}
