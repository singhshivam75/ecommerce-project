"use client";

import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar({
  onToggle,
}: {
  onToggle?: () => void;
}) {
  const { user, logout } = useAuth() as any;

  return (
    <header className="h-16 px-6 flex items-center justify-between sticky top-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-100/60 dark:border-slate-800/60 z-30">
      <div className="flex items-center gap-4 w-full max-w-2xl">
        <button onClick={onToggle} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">☰</button>

        <div className="flex-1">
          <input placeholder="Search products, orders, users..." className="input w-full" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm font-medium text-slate-700 dark:text-white">{user?.email}</span>
          <span className="text-xs text-slate-400">Admin</span>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-sm" />

        <button onClick={() => logout()} className="btn btn-primary">Logout</button>
      </div>
    </header>
  );
}