"use client";

import { Star, Eye } from "lucide-react";
import Badge from "@/src/components/ui/Badge";
import ProductActions from "./ProductActions";

export default function ProductInfo({ product }: any) {
  const averageRating = product.rating || 4.5;

  return (
    <div className="space-y-6">

      {/* Brand */}
      <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold uppercase">
        {product.brand || "Brand"}
      </div>

      {/* Title */}
      <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(averageRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <span className="font-semibold">
          {averageRating.toFixed(1)}
        </span>

        <span className="text-gray-500">
          ({product.reviews || 3} reviews)
        </span>

        <span className="text-gray-400">•</span>

        <span className="text-gray-500 flex items-center gap-1">
          <Eye className="w-4 h-4" />
          12 viewing
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-4xl font-bold">
          ${product.price}
        </span>

        {product.originalPrice && (
          <>
            <span className="text-xl text-gray-400 line-through">
              ${product.originalPrice}
            </span>

            <Badge variant="sale">
              {Math.round(
                (1 - product.price / product.originalPrice) * 100
              )}
              % OFF
            </Badge>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-lg">
        {product.description}
      </p>

      {/* Features */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border">
        <div className="text-center">
          <p className="text-sm font-medium">Free Shipping</p>
          <p className="text-xs text-gray-500">2-3 days</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">1 Year Warranty</p>
          <p className="text-xs text-gray-500">Included</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Easy Returns</p>
          <p className="text-xs text-gray-500">30 days</p>
        </div>
      </div>

      {/* Actions */}
      <ProductActions product={product} />
    </div>
  );
}