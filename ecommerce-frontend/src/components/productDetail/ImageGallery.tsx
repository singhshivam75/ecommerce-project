"use client";

import Image from "next/image";
import type { Product } from "@/src/types/product";

type Props = {
  images: NonNullable<Product["images"]>;
  selectedImage: string;
  setSelectedImage: (url: string) => void;
};

export default function ImageGallery(props: Readonly<Props>) {
  const { images, selectedImage, setSelectedImage } = props;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        {images.map((img) => (
          <Image
            key={img.id}
            src={img.url}
            alt={img.id}
            width={80}
            height={80}
            onClick={() => setSelectedImage(img.url)}
            className={`w-20 h-20 rounded-xl object-cover border cursor-pointer ${
              selectedImage === img.url
                ? "border-black"
                : "border-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="flex-1">
        <Image
          src={selectedImage}
          alt="main"
          width={600}
          height={600}
          className="w-full h-150 rounded-3xl object-cover shadow-md"
        />
      </div>
    </div>
  );
}
