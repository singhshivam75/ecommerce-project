"use client";

import React, { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { ProductsAPI } from "../../lib/products.api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Input from "../ui/Input";
import SelectCategory from "./SelectCategory";

export default function ProductForm({ product, isEdit }: any) {
  const router = useRouter();
  const { data: categories } = useFetch("/categories");

  // Normalize categories into a flat array with `parentId` for easier consumption
  const normalizedCategories = React.useMemo(() => {
    const cats = Array.isArray(categories)
      ? categories
      : categories && Array.isArray(categories.data)
      ? categories.data
      : [];
    return cats.map((c: any) => ({
      ...c,
      id: String(c.id),
      parentId:
        c.parentId !== undefined && c.parentId !== null
          ? String(c.parentId)
          : c.parent && typeof c.parent === "object"
          ? String(c.parent.id)
          : c.parent !== undefined && c.parent !== null
          ? String(c.parent)
          : null,
    }));
  }, [categories]);

  const [form, setForm] = useState({
    title: "",
    brand: "",
    basePrice: "",
    categoryId: "",
    subCategoryId: "",
    description: "",
    shortDescription: "",
    images: [{ url: "", isPrimary: true }],
  });

  useEffect(() => {
    if (!product) return;

    const parentId =
      product.category?.parentId ?? product.category?.parent?.id ?? null;

    const isSub = parentId !== null && parentId !== undefined;

    setForm({
      title: product.title || "",
      brand: product.brand || "",
      basePrice: product.basePrice || "",
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      categoryId: isSub
        ? String(parentId)
        : String(product.category?.id || ""),
      subCategoryId: isSub ? String(product.category.id) : "",
      images:
        product.images?.length > 0
          ? product.images
          : [{ url: "", isPrimary: true }],
    });
  }, [product]);

  const submit = async () => {
    try {
      const payload = {
        title: form.title,
        brand: form.brand,
        basePrice: Number(form.basePrice),
        categoryId: form.subCategoryId || form.categoryId,
        description: form.description,
        shortDescription: form.shortDescription,
      };

      let productId = product?.id;

      if (isEdit) {
        await ProductsAPI.update(productId, payload);
      } else {
        const res = await ProductsAPI.create(payload);
        productId = res.data.id;
      }

      for (const img of form.images) {
        if (!img.url) continue;

        await ProductsAPI.addImage({
          productId,
          url: img.url,
          isPrimary: img.isPrimary,
        });
      }

      toast.success(isEdit ? "Updated" : "Created");
      router.push("/products");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Add Product</h1>
            <p className="text-gray-500 text-sm">
              Create a new product and add all required details.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="px-5 py-2 border rounded-lg text-gray-600"
              onClick={() => router.back()}
            >
              Cancel
            </button>

            <button
              onClick={submit}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow"
            >
              Save Product
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="col-span-2 space-y-6">

            {/* PRODUCT INFO */}
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-semibold mb-4">Product Information</h2>

              <div className="grid grid-cols-2 gap-4">

                <Input label="Title *"
                  value={form.title}
                  onChange={(v:any)=>setForm({...form,title:v})}
                />

                <Input label="Brand"
                  value={form.brand}
                  onChange={(v:any)=>setForm({...form,brand:v})}
                />

                <Input label="Base Price *"
                  type="number"
                  value={form.basePrice}
                  onChange={(v:any)=>setForm({...form,basePrice:v})}
                />

                <SelectCategory
                  form={form}
                  setForm={setForm}
                  categories={normalizedCategories}
                />

              </div>

              <div className="mt-4">
                <Input label="Short Description"
                  value={form.shortDescription}
                  onChange={(v:any)=>setForm({...form,shortDescription:v})}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-semibold mb-4">Product Description</h2>

              <textarea
                rows={6}
                className="w-full border rounded-lg p-3 text-sm"
                placeholder="Enter product description..."
                value={form.description}
                onChange={(e)=>setForm({...form,description:e.target.value})}
              />
            </div>
          </div>

          {/* RIGHT SIDE IMAGES */}
          <div className="bg-white p-6 rounded-xl border h-fit">
            <h2 className="font-semibold mb-4">Product Images</h2>

            {/* Upload box */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center text-gray-500 mb-4">
              Click to upload or drag and drop <br />
              PNG, JPG up to 5MB
            </div>

            {/* Images list */}
            {form.images.map((img:any,i:number)=>(
              <div key={i} className="flex items-center gap-3 mb-3 border p-2 rounded-lg">

                <input
                  className="flex-1 text-sm outline-none"
                  placeholder="Image URL"
                  value={img.url}
                  onChange={(e)=>{
                    const copy=[...form.images];
                    copy[i].url=e.target.value;
                    setForm({...form,images:copy});
                  }}
                />

                <input
                  type="radio"
                  checked={img.isPrimary}
                  onChange={()=>{
                    const updated=form.images.map((x:any,idx:number)=>({
                      ...x,
                      isPrimary: idx===i
                    }));
                    setForm({...form,images:updated});
                  }}
                />

                <button
                  onClick={()=>setForm({
                    ...form,
                    images:form.images.filter((_:any,idx:number)=>idx!==i)
                  })}
                >
                  🗑
                </button>
              </div>
            ))}

            <button
              className="w-full border rounded-lg py-2 mt-2"
              onClick={()=>setForm({
                ...form,
                images:[...form.images,{url:"",isPrimary:false}]
              })}
            >
              + Add More Images
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}