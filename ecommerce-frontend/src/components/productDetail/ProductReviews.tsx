"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Badge from "@/src/components/ui/Badge";

const mockReviews = [
  {
    id: 1,
    author: "Sarah M.",
    rating: 5,
    date: "2026-04-15",
    comment:
      "Absolutely love this product! Quality is outstanding and delivery was super fast.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    ],
  },
  {
    id: 2,
    author: "Michael R.",
    rating: 4,
    date: "2026-04-10",
    comment:
      "Great value for money. Exactly as described. Would recommend!",
    verified: true,
  },
  {
    id: 3,
    author: "Emily K.",
    rating: 5,
    date: "2026-04-08",
    comment:
      "Exceeded my expectations. The build quality is premium and it looks amazing!",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    ],
  },
];

export default function ProductReviews() {
  const averageRating =
    mockReviews.reduce((sum, r) => sum + r.rating, 0) /
    mockReviews.length;

  return (
    <div className="mb-20">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Customer Reviews ({mockReviews.length})
        </h2>

        <p className="text-gray-500 mt-2">
          Average Rating: {averageRating.toFixed(1)} ⭐
        </p>
      </div>

      {/* Reviews */}
      <div className="grid md:grid-cols-3 gap-6">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition"
          >
            
            {/* Top */}
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-semibold">{review.author}</p>

                {/* Stars */}
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Date */}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>

              {/* Verified */}
              {review.verified && (
                <Badge className="text-xs">Verified</Badge>
              )}
            </div>

            {/* Comment */}
            <p className="text-gray-600 mb-4">
              {review.comment}
            </p>

            {/* Images */}
            {review.images && (
              <div className="flex gap-2">
                {review.images.map((img, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt="review"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}