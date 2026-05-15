"use client";

import { useParams } from "next/navigation";
import { useFetch } from "../../../../../hooks/useFetch";
import { useEffect, useState } from "react";
import { ProductsAPI } from "../../../../../lib/products.api";
import toast from "react-hot-toast";

export default function ProductVariantsPage() {
    const { id } = useParams();
    const { data: product, refetch } = useFetch(`/products/${id}`);

    const [variants, setVariants] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        sku: "",
        price: "",
        stock: "",
        color: "",
        size: "",
        image: "",
    });

    // sync product variants
    useEffect(() => {
        if (product?.variants) {
            setVariants(product.variants);
        }
    }, [product]);

    const input = `
    w-full px-3 py-2
    bg-slate-100 dark:bg-slate-800
    text-sm outline-none
  `;

    // ADD
    const addVariant = async () => {
        if (!form.sku || !form.price || !form.stock) {
            toast.error("Required fields missing");
            return;
        }

        setLoading(true);

        try {
            const res = await ProductsAPI.addVariant({
                productId: Number(id),
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
            });

            setVariants((prev) => [...prev, res.data]);
            setForm({
                sku: "",
                price: "",
                stock: "",
                color: "",
                size: "",
                image: "",
            });

            toast.success("Variant added");
        } catch {
            toast.error("Failed");
        } finally {
            setLoading(false);
        }
    };

    // UPDATE FIELD
    const updateField = (i: number, key: string, value: string) => {
        const updated = [...variants];
        updated[i][key] = value;
        setVariants(updated);
    };

    // SAVE
    const saveVariant = async (v: any) => {
        try {
            await ProductsAPI.updateVariant(v.id, {
                ...v,
                price: Number(v.price),
                stock: Number(v.stock),
            });

            toast.success("Updated");
            refetch();
        } catch {
            toast.error("Failed");
        }
    };

    // DELETE
    const deleteVariant = async (id: number) => {
        await ProductsAPI.deleteVariant(id);
        setVariants((prev) => prev.filter((v) => v.id !== id));
        toast.success("Deleted");
    };

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold">
                    Variants - {product?.title}
                </h1>
                <p className="text-sm text-slate-500">
                    Manage product variants
                </p>
            </div>

            {/* ADD FORM */}
            <div className="bg-white rounded-xl p-4 border grid grid-cols-3 gap-3">
                <input placeholder="SKU" className={input}
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />

                <input placeholder="Price" type="number" className={input}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />

                <input placeholder="Stock" type="number" className={input}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />

                <input placeholder="Color" className={input}
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                />

                <input placeholder="Size" className={input}
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                />

                <input placeholder="Image URL" className={input}
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                />

                <div className="col-span-3">
                    <button
                        onClick={addVariant}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                        {loading ? "Adding..." : "Add Variant"}
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl border overflow-hidden">

                <div className="grid grid-cols-7 px-4 py-2 text-xs font-semibold border-b bg-slate-50">
                    <div>SKU</div>
                    <div>Price</div>
                    <div>Stock</div>
                    <div>Color</div>
                    <div>Size</div>
                    <div>Image</div>
                    <div>Actions</div>
                </div>

                {variants.map((v, i) => (
                    <div key={v.id} className="grid grid-cols-7 px-4 py-3 border-b items-center">

                        <div>{v.sku}</div>

                        <input
                            className={input}
                            value={v.price}
                            onChange={(e) => updateField(i, "price", e.target.value)}
                        />

                        <input
                            className={input}
                            value={v.stock}
                            onChange={(e) => updateField(i, "stock", e.target.value)}
                        />

                        <input
                            className={input}
                            value={v.color || ""}
                            onChange={(e) => updateField(i, "color", e.target.value)}
                        />

                        <input
                            className={input}
                            value={v.size || ""}
                            onChange={(e) => updateField(i, "size", e.target.value)}
                        />

                        <input
                            className={input}
                            value={v.image || ""}
                            onChange={(e) => updateField(i, "image", e.target.value)}
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={() => saveVariant(v)}
                                className="text-green-600 text-sm"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => deleteVariant(v.id)}
                                className="text-red-500 text-sm"
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}