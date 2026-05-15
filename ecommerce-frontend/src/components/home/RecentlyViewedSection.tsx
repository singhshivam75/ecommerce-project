"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { ProductsAPI } from "@/src/lib/products";

export default async function RecentlyViewedSection() {
  const products = await ProductsAPI.getAll();
  const recentlyViewedProducts = products.slice(2, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-1">
            Recently Viewed
          </h2>
          <p className="text-gray-500">
            Pick up where you left off
          </p>
        </div>

        <Link
          href="/products"
          className="hidden md:flex items-center gap-2 text-indigo-600 hover:gap-3 transition-all font-medium"
        >
          View All
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentlyViewedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}