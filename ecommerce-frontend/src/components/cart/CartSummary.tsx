"use client"

import React from "react"

export default function CartSummary({ items }: { items: any[] }) {
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0)

  const savings = items.reduce(
    (total, item) => total + ((item.originalPrice || item.price) - item.price) * item.qty,
    0
  )

  return (
    <aside className="border border-gray-200 rounded-3xl p-8 h-fit sticky top-24 bg-white">
      <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

      <div className="border-t border-gray-200 pt-6 space-y-6">
        <div className="flex justify-between text-xl">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-black">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-xl">
          <span className="text-green-600">Savings</span>
          <span className="font-semibold text-green-600">-${savings.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-xl">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold text-green-600">FREE</span>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-2 text-green-700">🎉 You've qualified for free shipping!</div>
      </div>

      <div className="border-t border-gray-200 mt-8 pt-8">
        <div className="flex justify-between items-center mb-8">
          <span className="text-3xl font-bold">Total</span>
          <span className="text-3xl font-bold">${subtotal.toFixed(2)}</span>
        </div>

        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-2xl text-xl font-semibold hover:opacity-90 transition">Proceed to Checkout →</button>

        <button className="w-full mt-5 border border-gray-300 py-4 rounded-2xl text-xl font-medium hover:bg-gray-50 transition">Continue Shopping</button>

        <p className="text-gray-400 text-center text-sm mt-8 border-t pt-6">Secure checkout powered by industry-leading encryption</p>
      </div>
    </aside>
  )
}
