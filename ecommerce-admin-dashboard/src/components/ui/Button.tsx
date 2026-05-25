import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
};

export default function Button({ children, variant = 'primary', className = '', ...props }: Props) {
  const base = 'inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 focus:outline-none';
  const styles: Record<Variant,string> = {
    primary:
      'h-11 px-4 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-sm hover:shadow-md transform-gpu hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-100',
    secondary:
      'h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
    ghost:
      'h-11 px-3 rounded-xl bg-transparent text-slate-700 hover:bg-slate-50/40',
    danger:
      'h-11 px-4 rounded-xl bg-red-50 text-red-700 border border-red-100 hover:bg-red-100',
  };

  return (
    <button {...props} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}