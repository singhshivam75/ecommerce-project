import { ProductsAPI } from "@/src/lib/products";
import ProductPageClient from "@/src/components/product/ProductPageClient";

export default async function ProductsPage() {
  const products = await ProductsAPI.getAll({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    order: "DESC",
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Products</h1>

          <p className="text-gray-500">
            {products.length} items
          </p>
        </div>

        <ProductPageClient products={products} />
      </div>
    </div>
  );
}