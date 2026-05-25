import React from 'react';
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title?: string;
  children: React.ReactNode;
};

export default function IconButton({ title, children, className = '', ...props }: Props) {
  return (
    <button
      {...props}
      title={title}
      className={
        'inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-100 bg-white text-slate-600 hover:bg-slate-50 transition ' +
        className
      }
    >
      {children}
    </button>
  );
}
