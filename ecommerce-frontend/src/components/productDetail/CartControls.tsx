"use client";

import { CheckCircle, Truck } from "lucide-react";
import type { Product, ProductVariant } from "@/src/types/product";

type Props = {
  product: Product;
  selectedVariant?: ProductVariant;
};

export default function CartControls(props: Readonly<Props>) {
  const { product, selectedVariant } = props;
  const price = Number(selectedVariant?.price || product.basePrice);
  const addedOn = product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold">₹{price}</span>
        {selectedVariant?.compareAtPrice && (
          <span className="text-gray-400 line-through text-xl">₹{Number(selectedVariant.compareAtPrice)}</span>
        )}
      </div>

      <button
        disabled={!selectedVariant || selectedVariant.stock === 0}
        className="w-full bg-black text-white py-4 rounded-2xl text-lg hover:bg-gray-800 transition disabled:bg-gray-400"
      >
        Add to Cart
      </button>

      <div className="border-t pt-5 text-sm text-gray-500 space-y-2">
        <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Free Delivery</p>
        <p className="flex items-center gap-2"><Truck className="w-4 h-4" /> 7 Days Return Policy</p>
        <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Secure Payments</p>
        <p>✔ Product Slug: {product.slug}</p>
        <p>✔ Added On: {addedOn}</p>
      </div>
    </div>
  );
}
