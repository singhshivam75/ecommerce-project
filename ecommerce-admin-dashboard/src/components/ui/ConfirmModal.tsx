"use client";

import React from "react";

export default function ConfirmModal({
  open,
  title = "Confirm Action",
  message,
  onCancel,
  onConfirm,
  loading,
}: {
  open: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* MODAL */}
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow-lg border dark:border-slate-800 p-6">
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}