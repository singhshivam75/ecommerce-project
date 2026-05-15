import { Product } from "@/src/types/product";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

// import ProductCard from "./ProductCard";

// export default function ProductGrid({ products }: any) {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//       {products.map((p: any) => (
//         <ProductCard key={p.id} product={p} />
//       ))}
//     </div>
//   );
// }