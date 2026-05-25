"use client";

import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { className?: string };

export default function Input({ className = '', ...props }: Props) {
  return (
    <input
      {...props}
      className={`input w-full text-sm ${className}`}
    />
  );
}