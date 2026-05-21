import React from "react";
import { Archive, CheckCircle, Slash, Layers } from "lucide-react";

export default function CategoryStats({ stats }: { stats: any }) {
  const cards = [
    { title: "Total Categories", value: stats.total ?? 0, icon: <Layers className="w-6 h-6 text-indigo-600" /> },
    { title: "Active Categories", value: stats.active ?? 0, icon: <CheckCircle className="w-6 h-6 text-emerald-500" /> },
    { title: "Inactive Categories", value: stats.inactive ?? 0, icon: <Slash className="w-6 h-6 text-rose-500" /> },
    { title: "Total Subcategories", value: stats.subcategories ?? 0, icon: <Archive className="w-6 h-6 text-sky-500" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.title} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="p-3 rounded-xl bg-white/10">{c.icon}</div>
          <div>
            <div className="text-xs text-slate-400">{c.title}</div>
            <div className="text-2xl font-semibold mt-1">{c.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
