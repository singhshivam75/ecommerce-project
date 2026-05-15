"use client";

import React, { useState } from "react";
import { CategoriesAPI } from "@/src/lib/categories.api";
import toast from "react-hot-toast";

export default function CategoryImageUploader({ value, onChange }: any) {
  const [uploading, setUploading] = useState(false);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      setUploading(true);
      const res = await CategoriesAPI.uploadImage(fd);
      const url = res.data?.url ?? res.data?.data?.url ?? null;
      if (url) {
        onChange(url);
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch (e) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3">
          <img src={value} alt="cat" className="w-16 h-16 object-cover rounded-md" />
          <label className="text-sm text-indigo-600 hover:underline cursor-pointer">
            Change
            <input type="file" accept="image/*" onChange={handle} className="hidden" />
          </label>
        </div>
      ) : (
        <label className="block w-full text-center p-3 border border-dashed rounded-md cursor-pointer">
          Upload Image
          <input type="file" accept="image/*" onChange={handle} className="hidden" />
        </label>
      )}
      {uploading && <div className="text-sm text-slate-500">Uploading...</div>}
    </div>
  );
}
