import ProductCard from "../product/ProductCard";

export default function RelatedProducts({ products }: any) {
  if (!products.length) return null;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}