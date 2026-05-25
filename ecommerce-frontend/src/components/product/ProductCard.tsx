"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Eye, ArrowLeftRight, Star } from "lucide-react";
import { normalizeProduct } from "@/src/lib/transforms/normalizeProduct";
import { formatPrice, calculateDiscountPercentage } from "@/src/lib/formatters/price";
import type { Product } from "@/src/types/product";

export default function ProductCard(props: Readonly<{ product: Product }>) {
  const { product } = props;
  const router = useRouter();
  const p = normalizeProduct(product as any);

  const primary = p.images?.[0]?.url ?? "/placeholder.webp";
  const secondary = p.images?.[1]?.url ?? primary;

  const price = Number(p.pricing?.price ?? p.basePrice ?? 0);
  const compareAt = p.pricing?.compareAtPrice ?? undefined;
  const discount = calculateDiscountPercentage(price, compareAt);

  const stock = p.inventory?.available ?? p.variants?.[0]?.stock ?? undefined;
  const limited = typeof stock === "number" && stock > 0 && stock <= 5;
  let stockLabel: string;
  if (stock === undefined) {
    stockLabel = "";
  } else if (stock > 0) {
    stockLabel = "In stock";
  } else {
    stockLabel = "Out";
  }

  return (
    <div className="group">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition cursor-pointer">
          <div className="relative aspect-4/5 bg-gray-100 overflow-hidden" onClick={() => router.push(`/products/${p.slug}`)}>
          <Image src={primary} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          {secondary !== primary && (
            <Image src={secondary} alt={`${p.title}-alt`} fill className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {p.isFeatured && <span className="bg-black text-white text-xs px-3 py-1 rounded-full">Featured</span>}
            {p.isNewArrival && <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">New</span>}
            {discount > 0 && <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full">-{discount}%</span>}
            {(stock === 0 || p.status === "out_of_stock") && <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full">Out of stock</span>}
            {limited && <span className="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full">Limited</span>}
          </div>

          {/* Hover actions */}
          <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition">
            <div className="flex gap-2">
              <button className="bg-white p-2 rounded-xl shadow" aria-label="wishlist"><Heart className="w-4 h-4" /></button>
              <button className="bg-white p-2 rounded-xl shadow" aria-label="compare"><ArrowLeftRight className="w-4 h-4" /></button>
            </div>

            <div className="flex gap-2">
              <button className="bg-white p-2 rounded-xl shadow" aria-label="quick-view"><Eye className="w-4 h-4" /></button>
              <button className="bg-white p-2 rounded-xl shadow" aria-label="add-to-cart"><ShoppingCart className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">{p.brand ?? ""}</p>
          <h3 className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">{p.title}</h3>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">{formatPrice(price)}</span>
                {compareAt && <span className="text-sm text-gray-400 line-through">{formatPrice(Number(compareAt))}</span>}
              </div>
              <div className="flex items-center gap-2 text-yellow-500 text-sm mt-1">
                <Star className="w-4 h-4" /> <span className="font-medium">{p.rating ?? 0}</span>
                <span className="text-gray-400 text-xs">({p.totalReviews ?? 0})</span>
              </div>
            </div>

            <div className="text-right text-sm text-gray-500">{stockLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
