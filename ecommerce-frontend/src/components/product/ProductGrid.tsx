import { normalizeProduct } from "@/src/lib/transforms/normalizeProduct";
import ProductCard from "./ProductCard";
import type { Product } from "@/src/types/product";

export default function ProductGrid(props: Readonly<{ products: Product[] }>) {
  const { products } = props;
  if (!products || products.length === 0) {
    return <div className="py-20 text-center text-gray-500">No products found</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => {
        const normalized = normalizeProduct(p as any);
        return <ProductCard key={normalized.id} product={normalized} />;
      })}
    </div>
  );
}