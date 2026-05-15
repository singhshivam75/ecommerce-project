"use client";

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "sale" | "new" | "trending" | "default";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    sale: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
    new: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    trending: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",

    // ✅ fixed
    default: "bg-gray-200 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}