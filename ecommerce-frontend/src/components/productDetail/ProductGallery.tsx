"use client";

import Image from "next/image";

export default function ProductGallery({ product }: any) {
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-white rounded-3xl overflow-hidden border shadow-xl sticky top-24 group cursor-zoom-in">
        <Image
          src={product.image}
          alt={product.name}
          width={500}
          height={500}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
      </div>
    </div>
  );
}