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
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState(50000);

  // ✅ FETCH FROM API WHEN FILTERS CHANGE
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const data = await ProductsAPI.getAll({
        search,
        brand,
        maxPrice,
      });

      setProducts(data);
    }, 400); // debounce

    return () => clearTimeout(delayDebounce);
  }, [search, brand, maxPrice]);

  return (
    <div className="flex gap-10">
      
      {/* SIDEBAR */}
      <FiltersSidebar
        search={search}
        setSearch={setSearch}
        brand={brand}
        setBrand={setBrand}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      {/* PRODUCTS */}
      <div className="flex-1">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}