import { ProductsAPI } from "@/src/lib/products";
import ProductPageClient from "@/src/components/product/ProductPageClient";

export default async function ProductsPage() {
  const products = await ProductsAPI.getAll();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">{products.length} items</p>
        </div>

        <ProductPageClient products={products} />

      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { products } from "@/src/data/products";

// import FiltersSidebar from "@/src/components/product/FiltersSidebar";
// import ProductHeader from "@/src/components/product/ProductHeader";
// import ProductGrid from "@/src/components/product/ProductGrid";
// import EmptyState from "@/src/components/product/EmptyState";

// export default function ProductsPage() {
//   const [filters, setFilters] = useState({
//     category: "all",
//     price: [0, 500] as [number, number],
//     brand: "all",
//     rating: 0,
//     sort: "popularity",
//   });

//   const brands = Array.from(new Set(products.map(p => p.brand)));

//   let filtered = [...products];

//   if (filters.category !== "all") {
//     filtered = filtered.filter(p => p.category === filters.category);
//   }

//   filtered = filtered.filter(
//     p => p.price >= filters.price[0] && p.price <= filters.price[1]
//   );

//   if (filters.brand !== "all") {
//     filtered = filtered.filter(p => p.brand === filters.brand);
//   }

//   if (filters.rating > 0) {
//     filtered = filtered.filter(p => p.rating >= filters.rating);
//   }

//   if (filters.sort === "price-low") {
//     filtered.sort((a, b) => a.price - b.price);
//   } else if (filters.sort === "price-high") {
//     filtered.sort((a, b) => b.price - a.price);
//   } else if (filters.sort === "rating") {
//     filtered.sort((a, b) => b.rating - a.rating);
//   }

//   const clearFilters = () =>
//     setFilters({
//       category: "all",
//       price: [0, 500],
//       brand: "all",
//       rating: 0,
//       sort: "popularity",
//     });

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      
//       <FiltersSidebar
//         filters={filters}
//         setFilters={setFilters}
//         brands={brands}
//         clearFilters={clearFilters}
//       />

//       <div className="flex-1">
//         <ProductHeader
//           count={filtered.length}
//           filters={filters}
//           setFilters={setFilters}
//         />

//         {filtered.length === 0 ? (
//           <EmptyState clearFilters={clearFilters} />
//         ) : (
//           <ProductGrid products={filtered} />
//         )}
//       </div>
//     </div>
//   );
// }