import React from 'react';

type Props = Readonly<{ children: React.ReactNode; variant?: 'emerald'|'amber'|'slate'|'rose'|'violet'|'orange' }>;

export default function Badge({ children, variant = 'slate' }: Props) {
  const map: Record<string,string> = {
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
    rose: 'bg-rose-100 text-rose-700',
    violet: 'bg-violet-100 text-violet-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[variant] || map.slate}`}>
      {children}
    </span>
  );
}
