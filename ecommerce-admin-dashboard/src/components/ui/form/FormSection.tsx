"use client";

import React from 'react';

type Props = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

export default function FormSection({ title, description, children }: Props) {
  return (
    <section className="bg-white p-6 rounded-xl border">
      {title && (
        <div className="mb-4">
          <h3 className="font-semibold">{title}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}
