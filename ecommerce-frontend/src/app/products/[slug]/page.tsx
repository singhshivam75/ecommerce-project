import { ProductsAPI } from "@/src/lib/products";
import ProductDetails from "@/src/components/productDetail/ProductDetails";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: Props) {

  const { slug } = await params;

  console.log("SLUG:", slug);

  const product =
    await ProductsAPI.getBySlug(slug);

  if (!product) {
    return (
      <div className="p-10">
        Product not found
      </div>
    );
  }

  return (
    <ProductDetails product={product} />
  );
}