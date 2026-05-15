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
    <header className="
  h-16 px-6 flex items-center justify-between
  bg-white/80 dark:bg-slate-900/80
  backdrop-blur-md
  border-b border-slate-200 dark:border-slate-800
">
      {/* LEFT */}
      <div className="flex items-center gap-4 w-full max-w-xl">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          ☰
        </button>

        <input
          placeholder="Search..."
          className="
      w-full px-4 py-2 rounded-xl
      bg-slate-100 dark:bg-slate-800
      outline-none text-sm
    "
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-medium text-slate-700 dark:text-white">
            {user?.email}
          </span>
          <span className="text-xs text-slate-400">Admin</span>
        </div>

        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />

        <button
          onClick={() => logout()}
          className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}