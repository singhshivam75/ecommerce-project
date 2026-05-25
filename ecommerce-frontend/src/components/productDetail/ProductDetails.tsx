"use client";

import { useState } from "react";
import type { Product, ProductVariant } from "@/src/types/product";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import CartControls from "./CartControls";

export default function ProductDetails(props: Readonly<{ product: Product }>) {
  const { product } = props;
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const defaultVariant = variants.find((v) => v.isDefault) || variants[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    defaultVariant
  );

  const [selectedImage, setSelectedImage] = useState(
    product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url || "/placeholder.webp"
  );

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14">
        <ImageGallery images={product.images || []} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />

        <div className="space-y-7">
          <ProductInfo
            product={product}
            variants={variants}
            selectedVariant={selectedVariant}
            setSelectedVariant={(v) => setSelectedVariant(v)}
          />

          <div className="space-y-6">
            <CartControls product={product} selectedVariant={selectedVariant} />

            <div>
              <h2 className="text-xl font-bold">Description</h2>
              <p className="text-gray-600 leading-8">{product.description || "No description available"}</p>
            </div>

            {Array.isArray(product.specifications) && product.specifications.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Specifications</h2>
                <div className="border rounded-2xl overflow-hidden">
                  {product.specifications.map((spec) => (
                    <div key={spec.id} className="flex justify-between border-b last:border-0 px-5 py-4 bg-white">
                      <span className="font-medium">{spec.key}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}