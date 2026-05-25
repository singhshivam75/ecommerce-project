import React from 'react';

type CardProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export default function Card({
  children,
  className = '',
}: CardProps) {
  return (
    <div
      className={`
        bg-white
        border border-slate-100
        rounded-2xl
        shadow-sm hover:shadow-md
        transition-all duration-200
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}