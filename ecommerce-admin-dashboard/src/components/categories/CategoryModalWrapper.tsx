"use client";

import React from "react";
import CategoryForm from "./CategoryForm";
import { CategoriesAPI } from "@/src/lib/categories.api";
import toast from "react-hot-toast";

export default function CategoryModalWrapper({ mode = "create", initialData = null, parentId = null, onClose, onSuccess }: any) {
  const submit = async (values: any) => {
    try {
      if (mode === "edit" && initialData?.id) {
        await CategoriesAPI.update(initialData.id, { ...values, parentId: values.parentId ?? parentId ?? null });
        toast.success("Category updated");
      } else {
        await CategoriesAPI.create({ ...values, parentId: values.parentId ?? parentId ?? null });
        toast.success("Category created");
      }
      onSuccess?.();
    } catch (e) {
      toast.error("Failed to save category");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl p-6 bg-white rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{mode === 'edit' ? 'Edit Category' : 'Create Category'}</h3>
          <button onClick={onClose} className="text-slate-500">Close</button>
        </div>
        <CategoryForm initial={initialData ?? { parentId }} onSubmit={submit} onCancel={onClose} />
      </div>
    </div>
  );
}
