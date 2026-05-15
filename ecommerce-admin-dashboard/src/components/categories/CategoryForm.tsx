"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CategoryImageUploader from "./CategoryImageUploader";
import Button from "@/src/components/ui/Button";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
  parentId: z.string().nullable().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export default function CategoryForm({ initial = {}, onSubmit, onCancel }: any) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true, ...initial },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm">Name</label>
        <input {...register('name')} className="w-full px-3 py-2 rounded-md border" />
        {errors.name?.message && <div className="text-sm text-red-600">{String(errors.name.message)}</div>}
      </div>

      <div>
        <label className="block text-sm">Slug</label>
        <input {...register('slug')} className="w-full px-3 py-2 rounded-md border" />
      </div>

      <div>
        <label className="block text-sm">Description</label>
        <textarea {...register('description')} className="w-full px-3 py-2 rounded-md border" />
      </div>

      <div>
        <label className="block text-sm">Image</label>
        <CategoryImageUploader value={watch('image')} onChange={(v:any)=>setValue('image', v)} />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('isActive')} />
          <span className="text-sm">Active</span>
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm">SEO - Meta Title</label>
        <input {...register('metaTitle')} className="w-full px-3 py-2 rounded-md border" />

        <label className="block text-sm">SEO - Meta Description</label>
        <textarea {...register('metaDescription')} className="w-full px-3 py-2 rounded-md border" />
      </div>

      <div className="flex justify-between">
        <button type="button" className="text-sm text-slate-600" onClick={onCancel}>Cancel</button>
        <Button type="submit">Save Category</Button>
      </div>
    </form>
  );
}
