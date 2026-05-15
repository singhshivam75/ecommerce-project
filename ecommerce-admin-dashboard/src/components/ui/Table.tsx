import React from "react";

export default function Table({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <table className="min-w-full text-sm">
        {children}
      </table>
    </div>
  );
}