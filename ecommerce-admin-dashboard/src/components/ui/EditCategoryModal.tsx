"use client";

import React, { useState, useEffect } from "react";

export default function EditCategoryModal({
  open,
  category,
  categories,
  onClose,
  onSave,
}: any) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "",
    image: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        parentId: category.parent?.id || "",
        image: category.image || "",
        isActive: category.isActive ?? true,
      });
    }
  }, [category]);

  if (!open) return null;

  const input = `
    w-full px-4 py-2.5 rounded-xl
    bg-slate-100 dark:bg-slate-800
    focus:ring-2 focus:ring-indigo-200
    outline-none text-sm
  `;

  const submit = async () => {
    setLoading(true);
    try {
      await onSave({
        ...form,
        slug: form.slug || undefined,
        parentId: form.parentId ? Number(form.parentId) : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="
        relative w-full max-w-md p-6
        rounded-2xl
        bg-white/90 dark:bg-slate-900/90
        backdrop-blur-xl
        border border-slate-200/60 dark:border-slate-800
        shadow-2xl
      ">
        <h3 className="text-xl font-semibold mb-5">
          Edit Category
        </h3>

        <div className="space-y-4">

          {/* NAME */}
          <input
            value={form.name}
            placeholder="Name"
            className={input}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* SLUG */}
          <input
            value={form.slug}
            placeholder="Slug (optional)"
            className={input}
            onChange={(e) =>
              setForm({ ...form, slug: e.target.value })
            }
          />

          {/* IMAGE */}
          <input
            value={form.image}
            placeholder="Image URL"
            className={input}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />

          {/* DESCRIPTION */}
          <textarea
            value={form.description}
            placeholder="Description"
            className={input}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* STATUS */}
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm">Active Status</span>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
          </label>

        </div>

        {/* FOOTER */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="text-sm text-slate-500"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="
              px-5 py-2 rounded-xl
              bg-gradient-to-r from-indigo-500 to-purple-500
              text-white text-sm font-medium
              disabled:opacity-50
            "
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}