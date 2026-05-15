"use client";

import ProductCard from "../product/ProductCard";
import { TrendingUp } from "lucide-react";
import { ProductsAPI } from "@/src/lib/products";

export default async function TrendingNowSection() {
  const products = await ProductsAPI.getAll();
  const trendingProducts = products.slice(4, 8);

  return (
    <section className="bg-gradient-to-br from-gray-100 via-white to-gray-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Heading */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              Trending Now
            </h2>
            <p className="text-gray-500">
              What everyone's buying this week
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}