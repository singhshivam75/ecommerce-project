import React from 'react';

export default function FormError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-sm text-red-500">{children}</p>;
}
