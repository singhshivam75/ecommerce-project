"use client";

import React from "react";

export default function OrderDetailsModal({ order, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-3xl">

        <h2 className="text-xl font-semibold mb-4">
          Order #{order.id}
        </h2>

        {/* USER INFO */}
        <div className="mb-4">
          <h3 className="font-medium mb-1">Customer</h3>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            {order.user?.email}
          </div>
        </div>

        {/* ORDER INFO */}
        <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-slate-500">Total</div>
            <div className="font-medium">₹{order.totalPrice}</div>
          </div>

          <div>
            <div className="text-slate-500">Status</div>
            <div className="capitalize font-medium">
              {order.status}
            </div>
          </div>

          <div>
            <div className="text-slate-500">Items</div>
            <div className="font-medium">
              {order.items?.length || 0}
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="border rounded-lg overflow-hidden">

          <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-slate-500 border-b">
            <div className="col-span-6">Product</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {(order.items || []).map((item: any) => (
            <div
              key={item.id}
              className="grid grid-cols-12 px-4 py-3 border-b text-sm"
            >
              <div className="col-span-6">
                {item.product?.title || "Product"}
              </div>

              <div className="col-span-2">
                ₹{item.price}
              </div>

              <div className="col-span-2">
                {item.quantity}
              </div>

              <div className="col-span-2 text-right font-medium">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* CLOSE */}
        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}