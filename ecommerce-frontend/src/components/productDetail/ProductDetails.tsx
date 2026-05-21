"use client";

import { useState } from "react";
import { Product, ProductVariant } from "@/src/types/product";

export default function ProductDetails({ product }: { product: Product }) {
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const defaultVariant =
        variants.find((v) => v.isDefault) ||
        variants[0];

    const [selectedVariant, setSelectedVariant] =
        useState<ProductVariant | undefined>(defaultVariant);

    const [selectedImage, setSelectedImage] = useState(
        product.images?.find((img) => img.isPrimary)?.url ||
        product.images?.[0]?.url ||
        "/placeholder.webp"
    );

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">

                {/* LEFT: IMAGE GALLERY */}
                <div className="flex gap-4">

                    {/* THUMBNAILS */}
                    <div className="flex flex-col gap-3">
                        {product.images?.map((img) => (
                            <img
                                key={img.id}
                                src={img.url}
                                onClick={() => setSelectedImage(img.url)}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${selectedImage === img.url
                                        ? "border-black"
                                        : "border-gray-200"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* MAIN IMAGE */}
                    <div className="flex-1">
                        <img
                            src={selectedImage}
                            className="w-full h-[500px] object-cover rounded-2xl shadow-md"
                        />
                    </div>
                </div>

                {/* RIGHT: PRODUCT INFO */}
                <div className="space-y-6">

                    {/* TITLE */}
                    <div>
                        <h1 className="text-3xl font-bold">{product.title}</h1>
                        <p className="text-gray-500 mt-2">
                            {product.shortDescription || "No description"}
                        </p>
                    </div>

                    {/* PRICE */}
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold">
                            ₹{Number(selectedVariant?.price || product.basePrice)}
                        </span>

                        {selectedVariant?.compareAtPrice && (
                            <span className="text-gray-400 line-through">
                                ₹{Number(selectedVariant.compareAtPrice)}
                            </span>
                        )}
                    </div>

                    {/* COLOR */}
                    {variants.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">Color</h3>
                            <div className="flex gap-3 flex-wrap">
                                {variants.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(v)}
                                        className={`px-4 py-2 rounded-lg border text-sm ${selectedVariant?.id === v.id
                                                ? "bg-black text-white"
                                                : "bg-white"
                                            }`}
                                    >
                                        {v.color || "N/A"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SIZE */}
                    {variants.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">Size</h3>
                            <div className="flex gap-3 flex-wrap">
                                {variants.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(v)}
                                        className={`px-4 py-2 rounded-lg border text-sm ${selectedVariant?.id === v.id
                                                ? "bg-black text-white"
                                                : "bg-white"
                                            }`}
                                    >
                                        {v.size || "N/A"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STOCK */}
                    <p className="text-sm text-gray-500">
                        {selectedVariant?.stock
                            ? `${selectedVariant.stock} items available`
                            : "Out of stock"}
                    </p>

                    {/* CTA */}
                    <button
                        disabled={!selectedVariant || selectedVariant.stock === 0}
                        className="w-full bg-black text-white py-4 rounded-xl text-lg hover:bg-gray-800 transition disabled:bg-gray-400"
                    >
                        {selectedVariant?.stock ? "Add to Cart" : "Out of Stock"}
                    </button>

                    <p className="text-gray-500 mt-2">
                        {product.description || "No description"}
                    </p>

                    {/* EXTRA INFO */}
                    <div className="border-t pt-4 text-sm text-gray-500 space-y-1">
                        <p>✔ Free delivery</p>
                        <p>✔ 7 days return policy</p>
                        <p>✔ Secure payment</p>
                    </div>

                </div>
            </div>
        </div>
    );
}


