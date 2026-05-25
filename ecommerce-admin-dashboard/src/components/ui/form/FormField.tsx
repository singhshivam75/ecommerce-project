"use client";

import React from 'react';
type Props = Readonly<{
  label?: string;
  help?: string;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
}>;

export default function FormField({ label, help, error = null, children, className = '' }: Props) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="text-sm font-medium mb-1">{label}</label>}
      {children}
      {error ? (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      ) : (
        help && <p className="text-xs text-gray-400 mt-1">{help}</p>
      )}
    </div>
  );
}
