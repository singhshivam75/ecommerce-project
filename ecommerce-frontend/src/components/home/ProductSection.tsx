import ProductCard from "../product/ProductCard";
import { Sparkles } from "lucide-react";
import { ProductsAPI } from "@/src/lib/products";

export default async function ProductSection() {
  // ✅ fetch from backend
  const products = await ProductsAPI.getAll();

  // ✅ take first 4 (recommended)
  const recommendedProducts = products.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      {/* Heading */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        <div>
          <h2 className="text-3xl font-bold">
            Recommended for You
          </h2>
          <p className="text-gray-500">
            Curated picks based on your preferences
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}