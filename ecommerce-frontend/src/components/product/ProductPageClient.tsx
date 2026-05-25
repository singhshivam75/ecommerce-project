"use client";

import { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";
import FiltersSidebar from "./FiltersSidebar";
import { Product } from "@/src/types/product";
import { ProductsAPI } from "@/src/lib/products";

export default function ProductPageClient({
  products: initialProducts,
}: {
  products: Product[];
}) {
  const [products, setProducts] =
    useState<Product[]>(initialProducts);

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    brand: "",
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    order: "DESC" as "ASC" | "DESC",
  });

  useEffect(() => {
    const debounce = setTimeout(async () => {

      try {
        const hasFilters =
          filters.search ||
          filters.brand;

        // ✅ NO FILTERS
        if (!hasFilters) {
          setProducts(initialProducts);
          return;
        }

        setLoading(true);

        const data =
          await ProductsAPI.getAll(filters);

        if (Array.isArray(data)) {
          setProducts(data);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }

    }, 400);

    return () => clearTimeout(debounce);

  }, [filters, initialProducts]);

  const updateFilter = (
    key: string,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  return (
    <div className="flex gap-10">

      {/* FILTERS */}
      <FiltersSidebar
        filters={filters}
        updateFilter={updateFilter}
      />

      {/* PRODUCTS */}
      <div className="flex-1">

        {loading && (
          <p className="mb-4 text-gray-500">
            Loading products...
          </p>
        )}

        <ProductGrid products={products} />
      </div>
    </div>
  );
}