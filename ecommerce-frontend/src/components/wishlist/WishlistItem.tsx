"use client"

import Image from "next/image"
import { ShoppingBag, Trash2, Star } from "lucide-react"
import React from "react"

interface Product {
  id: string
  title: string
  price: number
  category?: string
  rating?: number
  image: string
  stock?: string
}

export default function WishlistItem({
  product,
  onAddToCart,
  onRemove,
}: {
  product: Product
  onAddToCart: (p: Product) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          width={500}
          height={500}
          className="w-full h-[320px] object-cover group-hover:scale-105 transition duration-500"
        />

        <button className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition">
          <Trash2 size={20} onClick={() => onRemove(product.id)} className="text-red-500" />
        </button>

        {product.category && (
          <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">{product.category}</div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-medium text-gray-700">{product.rating ?? 0}</span>
          </div>

          <span className="text-gray-300">•</span>

          <span className="text-sm text-green-600 font-medium">{product.stock}</span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{product.title}</h3>

        <div className="mt-4 flex items-end gap-2">
          <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-400 line-through">${(product.price + 20).toFixed(2)}</span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={() => onAddToCart(product)} className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-500 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition">
            <ShoppingBag size={18} />
            Add to Cart
          </button>

          <button onClick={() => onRemove(product.id)} className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
