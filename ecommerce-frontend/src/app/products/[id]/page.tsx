import { ProductsAPI } from "@/src/lib/products";
import ProductDetails from "@/src/components/productDetail/ProductDetails";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ FIX TYPE
}) {
  // ✅ unwrap params
  const { id } = await params;

  console.log("REAL ID:", id); // should print "11"

  const numericId = Number(id);

  // ✅ safe check
  if (!numericId || isNaN(numericId)) {
    return <div className="p-10">Invalid Product</div>;
  }

  const product = await ProductsAPI.getById(numericId);

  return <ProductDetails product={product} />;
}

// "use client";

// import { useParams } from "next/navigation";
// import { products } from "@/src/data/products";

// import ProductGallery from "@/src/components/productDetail/ProductGallery";
// import ProductInfo from "@/src/components/productDetail/ProductInfo";
// import ProductReviews from "@/src/components/productDetail/ProductReviews";
// import RelatedProducts from "@/src/components/productDetail/RelatedProducts";
// import ProductActions from "@/src/components/productDetail/ProductActions";

// export default function ProductDetailsPage() {
//   const { id } = useParams();
//   const product = products.find((p) => p.id === id);

//   if (!product) {
//     return <div className="p-10 text-center">Product not found</div>;
//   }

//   const related = products.filter(p =>
//     product.relatedProducts?.includes(p.id)
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10 ">

//       {/* Top */}
//       <div className="grid md:grid-cols-2 gap-12 mb-16">
//         <ProductGallery product={product} />
//         <ProductInfo product={product} />
//       </div>

//       {/* Reviews */}
//       <ProductReviews />

//       {/* Related */}
//       <RelatedProducts products={related} />
//     </div>
//   );
// }