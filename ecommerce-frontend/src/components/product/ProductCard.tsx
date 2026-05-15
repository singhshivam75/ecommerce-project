"use client";

import { Product } from "@/src/types/product";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  const image =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8";

  return (
    <div
      onClick={() => router.push(`/products/${product.id}`)}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />

        <div className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
          SALE
        </div>

        <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition">
          ❤️
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-2">

        <p className="text-xs text-gray-400 uppercase tracking-wide">
          {product.brand || "Brand"}
        </p>

        <h2 className="text-base font-semibold text-gray-800 line-clamp-2">
          {product.title}
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-black">
            ₹{Number(product.basePrice)}
          </span>

          <span className="text-sm text-gray-400 line-through">
            ₹{Number(product.basePrice) + 500}
          </span>
        </div>

        <div className="flex items-center gap-1 text-yellow-500 text-sm">
          ⭐ {product.rating || 4.5}
          <span className="text-gray-400 text-xs">
            ({product.totalReviews || 12})
          </span>
        </div>
      </div>
    </div>
  );
}


// "use client";

// import Link from "next/link";
// import { Star, ShoppingCart, Eye } from "lucide-react";
// import { useState } from "react";
// import Image from "next/image";
// import toast from "react-hot-toast";

// interface Product {
//   id: string;
//   name: string;
//   image: string;
//   price: number;
//   originalPrice?: number;
//   brand: string;
//   rating: number;
//   reviews: number;
// }

// interface ProductCardProps {
//   product: Product;
// }

// export default function ProductCard({ product }: ProductCardProps) {
//   const [isHovered, setIsHovered] = useState(false);

//   const discount = product.originalPrice
//     ? Math.round((1 - product.price / product.originalPrice) * 100)
//     : 0;

//   const handleQuickAdd = (e: React.MouseEvent) => {
//     e.preventDefault();

//     const cart = JSON.parse(localStorage.getItem("cart") || "[]");

//     const existing = cart.find((item: any) => item.productId === product.id);

//     if (existing) {
//       existing.quantity += 1;
//     } else {
//       cart.push({ productId: product.id, quantity: 1 });
//     }

//     localStorage.setItem("cart", JSON.stringify(cart));

//     toast.success("Added to cart");
//     window.dispatchEvent(new Event("storage"));
//   };

//   return (
//     <div
//       className="group relative"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <Link href={`/products/${product.id}`}>
//         <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary/40 transition-all duration-300 hover:shadow-xl">
          
//           {/* Image */}
//           <div className="aspect-square bg-gray-100 overflow-hidden relative">
//             <Image
//               src={product.image}
//               alt={product.name}
//               width={400}
//               height={400}
//               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//             />

//             {/* Discount */}
//             {discount > 0 && (
//               <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
//                 -{discount}%
//               </span>
//             )}

//             {/* Hover Actions */}
//             <div
//               className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
//                 isHovered ? "opacity-100" : "opacity-0"
//               }`}
//             >
//               <button
//                 onClick={handleQuickAdd}
//                 className="bg-white p-3 rounded-xl hover:bg-primary hover:text-white transition transform hover:scale-110"
//               >
//                 <ShoppingCart className="w-5 h-5" />
//               </button>

//               <button className="bg-white p-3 rounded-xl hover:bg-primary hover:text-white transition transform hover:scale-110">
//                 <Eye className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="p-5">
            
//             <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
//               {product.brand}
//             </p>

//             <h3 className="line-clamp-2 mb-3 font-semibold group-hover:text-primary transition">
//               {product.name}
//             </h3>

//             {/* Rating */}
//             <div className="flex items-center gap-1 mb-3">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   className={`w-3.5 h-3.5 ${
//                     i < Math.floor(product.rating)
//                       ? "fill-yellow-400 text-yellow-400"
//                       : "text-gray-300"
//                   }`}
//                 />
//               ))}
//               <span className="text-xs text-gray-500 ml-1">
//                 ({product.reviews})
//               </span>
//             </div>

//             {/* Price */}
//             <div className="flex items-center gap-2">
//               <span className="text-lg font-bold">
//                 ${product.price}
//               </span>

//               {product.originalPrice && (
//                 <span className="text-sm text-gray-400 line-through">
//                   ${product.originalPrice}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }