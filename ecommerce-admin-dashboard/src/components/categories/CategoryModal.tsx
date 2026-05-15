"use client";

import { useState, useEffect } from "react";
import api from "@/src/lib/api";
import toast from "react-hot-toast";
import { CategoriesAPI } from "@/src/lib/categories.api";

export default function CategoryModal({
  mode = "create", // "create" | "edit"
  title,
  initialData = null,
  parentId = null,
  onClose,
  onSuccess,
}: any) {

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    isActive: true,
  });

  const [parents, setParents] = useState<any[]>([]);
  const [selectedParent, setSelectedParent] = useState<string | null>(parentId ? String(parentId) : null);

  const [loading, setLoading] = useState(false);

  // 👉 Handle Edit Mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        image: initialData.image || "",
        isActive: initialData.isActive ?? true,
      });
      // set selected parent from initial data
      const p = initialData.parentId ?? initialData.parent?.id ?? null;
      setSelectedParent(p ? String(p) : null);
    }
  }, [mode, initialData]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await CategoriesAPI.getMainCategories({ page: 1, limit: 9999 });
        const data = res.data?.data ?? res.data ?? [];
        if (!mounted) return;
        setParents(Array.isArray(data) ? data.filter((c:any)=>c.id !== initialData?.id).map((d:any)=>({ ...d, id: String(d.id) })) : []);
      } catch (e) {
        setParents([]);
      }
    })();

    return () => { mounted = false; };
  }, [initialData]);

const submit = async () => {
  if (!form.name) {
    toast.error("Name required");
    return;
  }

  try {
    setLoading(true);

    if (mode === "edit") {
      await api.patch(`/categories/${initialData.id}`, {
        ...form,
        slug: form.slug || undefined,
        parentId: selectedParent || null,
      });

      toast.success("Category updated");
    } else {
      await api.post("/categories", {
        ...form,
        slug: form.slug || undefined,
        parentId: selectedParent || parentId || null, // create case
      });

      toast.success(
        parentId ? "Sub category created" : "Category created"
      );
    }

    onSuccess();
  } catch {
    toast.error("Failed");
  } finally {
    setLoading(false);
  }
};

  const input = `
    w-full px-4 py-2.5 rounded-xl
    bg-slate-100 dark:bg-slate-800
    focus:ring-2 focus:ring-indigo-200
    outline-none text-sm
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="
        relative w-full max-w-md p-6
        rounded-2xl
        bg-white/90 dark:bg-slate-900/90
        backdrop-blur-xl
        border border-slate-200/60 dark:border-slate-800
        shadow-2xl
      ">
        <h3 className="text-xl font-semibold mb-5">
          {title || (mode === "edit" ? "Edit Category" : "Create Category")}
        </h3>

        <div className="space-y-4">
          <input
            value={form.name}
            placeholder="Name"
            className={input}
            onChange={(e) => {
              const name = e.target.value;
              setForm({
                ...form,
                name,
                slug: mode === "create" ? generateSlug(name) : form.slug,
              });
            }}
          />

          <input
            value={form.slug}
            placeholder="Slug (optional)"
            className={input}
            onChange={(e) =>
              setForm({ ...form, slug: e.target.value })
            }
          />

          <div>
            <label className="text-sm mb-1 block">Parent Category</label>
            <select
              value={selectedParent ?? ""}
              onChange={(e) => setSelectedParent(e.target.value || null)}
              className={input}
            >
              <option value="">No parent (main category)</option>
              {parents.map((p) => (
                <option key={p.id} value={String(p.id)}>{p.name}</option>
              ))}
            </select>
          </div>

          <input
            value={form.image}
            placeholder="Image URL"
            className={input}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />

          <textarea
            value={form.description}
            placeholder="Description"
            className={input}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            <span className="text-sm">
              {form.isActive ? "Active" : "Inactive"}
            </span>
          </label>
        </div>

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
            {loading
              ? mode === "edit"
                ? "Updating..."
                : "Creating..."
              : mode === "edit"
              ? "Update"
              : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}