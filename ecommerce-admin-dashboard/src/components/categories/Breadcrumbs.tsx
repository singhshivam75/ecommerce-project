import React from "react";

export default function Breadcrumbs({ items }: { items: { id?: string; label: string }[] }) {
  return (
    <nav className="text-sm text-slate-500">
      {items.map((it, idx) => (
        <span key={idx} className="inline-flex items-center">
          {idx > 0 && <span className="mx-2">/</span>}
          <span className={idx === items.length - 1 ? "text-slate-800 font-medium" : "hover:underline cursor-pointer"}>{it.label}</span>
        </span>
      ))}
    </nav>
  );
}
