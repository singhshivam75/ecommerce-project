"use client"

import React from "react"
import { RotateCcw, Truck } from "lucide-react"
import OrderItem from "@/src/components/orders/OrderItem"
import { statusStyles, statusIcons, OrderStatus } from "@/src/lib/orderStatus"

interface OrderItemType {
  id: string
  title: string
  subtitle?: string
  price: number
  quantity: number
  image: string
}

interface OrderType {
  id: string
  date: string
  total: number
  status: OrderStatus
  items: OrderItemType[]
}

export default function OrderCard({ order }: { order: OrderType }) {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[28px] overflow-hidden">
      <div className="px-7 py-7 border-b border-[#E9E9E9] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
          <div>
            <p className="text-[12px] tracking-wide uppercase text-[#8B8B8B] mb-2">Order ID</p>
            <h3 className="text-[18px] font-bold">{order.id}</h3>
          </div>

          <div>
            <p className="text-[12px] tracking-wide uppercase text-[#8B8B8B] mb-2">Date Placed</p>
            <h3 className="text-[18px] font-semibold">{order.date}</h3>
          </div>

          <div>
            <p className="text-[12px] tracking-wide uppercase text-[#8B8B8B] mb-2">Total Amount</p>
            <h3 className="text-[18px] font-bold">${order.total.toFixed(2)}</h3>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-[18px] w-fit ${statusStyles[order.status]}`}>
          {statusIcons[order.status]}
          {order.status}
        </div>
      </div>

      <div className="px-7 py-8">
        <div className="space-y-10">
          {order.items.map((item, idx) => (
            <OrderItem key={item.id} {...item} isLast={idx === order.items.length - 1} />
          ))}
        </div>

        <div className="flex justify-end gap-5 mt-10 pt-8 border-t border-[#ECECEC]">
          <button className="h-[50px] px-10 rounded-[20px] border border-[#D9D9D9] text-[18px] font-medium hover:bg-gray-50 transition">View Details</button>

          <button className="h-[50px] px-10 rounded-[20px] bg-[#2563FF] hover:bg-[#1f57e6] transition text-white text-[18px] font-semibold flex items-center gap-3 shadow-lg shadow-blue-500/20">
            {order.status === "Shipped" ? (
              <>
                <Truck size={18} />
                Track Order
              </>
            ) : (
              <>
                <RotateCcw size={18} />
                Reorder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
