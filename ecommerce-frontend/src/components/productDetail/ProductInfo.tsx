"use client";

import { Star } from "lucide-react";
import type { Product, ProductVariant } from "@/src/types/product";
import VariantSelector from "./VariantSelector";

type Props = {
  product: Product;
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  setSelectedVariant: (v: ProductVariant) => void;
};

export default function ProductInfo(props: Readonly<Props>) {
  const { product, variants, selectedVariant, setSelectedVariant } = props;
  const colors = Array.from(
    new Set(variants.map((v) => v.color).filter(Boolean))
  ) as string[];
  const sizes = Array.from(
    new Set(variants.map((v) => v.size).filter(Boolean))
  ) as string[];

  return (
    <>
      <p className="uppercase tracking-widest text-sm text-gray-500">
        {product.brand}
      </p>

      <div>
        <h1 className="text-4xl font-bold">{product.title}</h1>
        <p className="text-gray-500 mt-3">{product.shortDescription}</p>
      </div>

      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-yellow-500" />
        <span className="font-medium">{product.rating || 4.5}</span>
        <span className="text-gray-500 text-sm">({product.totalReviews || 12} reviews)</span>
      </div>

      {colors.length > 0 && (
        <VariantSelector
          title="Colors"
          options={colors}
          selected={selectedVariant?.color ?? undefined}
          onSelect={(val) => {
            const v = variants.find((x) => x.color === val);
            if (v) setSelectedVariant(v);
          }}
        />
      )}

      {sizes.length > 0 && (
        <VariantSelector
          title="Sizes"
          options={sizes}
          selected={selectedVariant?.size ?? undefined}
          onSelect={(val) => {
            const v = variants.find((x) => x.size === val);
            if (v) setSelectedVariant(v);
          }}
        />
      )}

      <div>
        {selectedVariant?.stock ? (
          <p className="text-green-600 font-medium">In Stock ({selectedVariant.stock} left)</p>
        ) : (
          <p className="text-red-500">Out of Stock</p>
        )}
      </div>
    </>
  );
}
