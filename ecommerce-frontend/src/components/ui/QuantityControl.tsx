"use client"

import React from "react"

export default function QuantityControl({
  value,
  onDecrement,
  onIncrement,
}: {
  value: number
  onDecrement: () => void
  onIncrement: () => void
}) {
  return (
    <div className="mt-6 flex items-center bg-gray-100 rounded-2xl w-fit overflow-hidden">
      <button onClick={onDecrement} className="px-3 text-2xl">-</button>
      <span className="px-3 font-medium">{value}</span>
      <button onClick={onIncrement} className="px-3 text-2xl">+</button>
    </div>
  )
}
