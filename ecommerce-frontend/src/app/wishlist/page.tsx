"use client"

import { useState } from "react"
import WishlistItem from "@/src/components/wishlist/WishlistItem"
import { Heart } from "lucide-react"

export default function WishlistPage() {
  const [products, setProducts] = useState([
    {
      id: "w1",
      title: "Corduroy Jacket",
      price: 89.99,
      category: "Apparel",
      rating: 4.8,
      image: "/placeholder.webp",
      stock: "In Stock",
    },
    {
      id: "w2",
      title: "Canvas Tote",
      price: 24.5,
      category: "Accessories",
      rating: 4.6,
      image: "/placeholder.webp",
      stock: "Only 3 left",
    },
    {
      id: "w3",
      title: "Beanie",
      price: 14.0,
      category: "Accessories",
      rating: 4.9,
      image: "/placeholder.webp",
      stock: "In Stock",
    },
  ])

  const handleAddToCart = (p: any) => {
    // wire up cart logic; for now just log
    console.log("Add to cart", p)
  }

  const handleRemove = (id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-10 px-6 rounded-b-[40px] shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">My Wishlist</h1>
            <p className="mt-3 text-gray-300 text-sm md:text-base max-w-xl">Save your favorite products and move them to cart anytime.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"><Heart className="text-red-400 fill-red-400" size={28} /></div>
            <div>
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-sm text-gray-300">Saved Products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Saved Items</h2>
            <p className="text-gray-500 mt-1">Products you may want to purchase later.</p>
          </div>

          <button className="px-5 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition text-sm font-medium" onClick={() => setProducts([])}>Clear Wishlist</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((p) => (
            <WishlistItem key={p.id} product={p} onAddToCart={handleAddToCart} onRemove={handleRemove} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center"><Heart size={40} className="text-gray-400" /></div>
            <h3 className="mt-6 text-2xl font-bold text-gray-800">Your wishlist is empty</h3>
            <p className="mt-2 text-gray-500">Browse products and save your favorites here.</p>
            <button className="mt-6 px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition">Explore Products</button>
          </div>
        )}
      </div>
    </div>
  )
}