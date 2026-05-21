"use client"

import { useState } from "react"
import CartItem from "@/src/components/cart/CartItem"
import CartSummary from "@/src/components/cart/CartSummary"

export default function CartPage() {
  const [items, setItems] = useState([
    {
      id: "p1",
      title: "Wireless Bluetooth Headphones",
      price: 79.99,
      originalPrice: 129.99,
      qty: 1,
      img: "/placeholder.webp",
    },
    {
      id: "p2",
      title: "Smart Watch Series 5",
      price: 299.99,
      originalPrice: 349.99,
      qty: 1,
      img: "/placeholder.webp",
    },
  ])

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: Math.max(1, item.qty + delta),
            }
          : item
      )
    )
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-black mb-2">Shopping Cart</h1>
          <p className="text-gray-500 text-2xl">{items.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
          <div className="space-y-6">
            {items.map((item) => (
              <CartItem key={item.id} item={item} onUpdateQty={updateQty} onRemove={removeItem} />
            ))}
          </div>

          <CartSummary items={items} />
        </div>
      </div>
    </div>
  )
}