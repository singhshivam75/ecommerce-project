"use client"

import Image from "next/image"
import React from "react"
import QuantityControl from "@/src/components/ui/QuantityControl"

interface Item {
  id: string
  title: string
  price: number
  originalPrice?: number
  qty: number
  img: string
}

export default function CartItem({
  item,
  onUpdateQty,
  onRemove,
}: {
  item: Item
  onUpdateQty: (id: string, delta: number) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="border border-gray-200 rounded-3xl p-6 flex flex-col md:flex-row gap-6 bg-white">
      <div className="w-36 h-36 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
        <Image src={item.img} alt={item.title} width={250} height={250} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-black">{item.title}</h2>

            <QuantityControl
              value={item.qty}
              onDecrement={() => onUpdateQty(item.id, -1)}
              onIncrement={() => onUpdateQty(item.id, 1)}
            />
          </div>

          <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500">🗑️</button>
        </div>

        <div className="mt-6">
          <div className="text-2xl font-bold text-black">${item.price.toFixed(2)}</div>
          {item.originalPrice && (
            <div className="text-gray-400 line-through text-sm">${item.originalPrice.toFixed(2)}</div>
          )}
        </div>
      </div>
    </div>
  )
}
