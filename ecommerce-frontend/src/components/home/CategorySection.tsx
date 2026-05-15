import Link from "next/link";
import { CategoriesAPI } from "@/src/lib/categories";

export default async function CategorySection() {
  const categories = await CategoriesAPI.getAll();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          Shop by Category
        </h2>
        <p className="text-gray-500 text-lg">
          Find exactly what you're looking for
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-4 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            {/* IMAGE OR FALLBACK */}
            <div className="text-4xl">
              {category.image ? (
                <img
                  src={category.image}
                  className="w-12 h-12 object-cover"
                />
              ) : (
                "📦"
              )}
            </div>

            <span className="text-center font-medium group-hover:text-indigo-600 transition">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}