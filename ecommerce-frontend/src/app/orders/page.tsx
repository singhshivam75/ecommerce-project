"use client"

import { useEffect, useState } from "react"
import OrderCard from "@/src/components/orders/OrderCard"

interface OrderItem {
  id: string
  title: string
  subtitle?: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  date: string
  total: number
  status: "Delivered" | "Shipped" | "Processing"
  items: OrderItem[]
}

const ordersData: Order[] = [
  {
    id: "ORD-2026-001",
    date: "Apr 20, 2026",
    total: 109.98,
    status: "Delivered",
    items: [
      {
        id: "1",
        title: "Wireless Bluetooth Headphones",
        subtitle: "Color: Black",
        price: 79.99,
        quantity: 1,
        image: "/placeholder.webp",
      },
      {
        id: "2",
        title: "Wireless Charger Pad",
        subtitle: "Color: White",
        price: 29.99,
        quantity: 1,
        image: "/placeholder.webp",
      },
    ],
  },
  {
    id: "ORD-2026-002",
    date: "Apr 23, 2026",
    total: 119.99,
    status: "Shipped",
    items: [
      {
        id: "3",
        title: "Premium Running Shoes",
        subtitle: "Size: 10 • Color: Blue",
        price: 119.99,
        quantity: 1,
        image: "/placeholder.webp",
      },
    ],
  },
  {
    id: "ORD-2026-003",
    date: "Apr 24, 2026",
    total: 359.98,
    status: "Processing",
    items: [
      {
        id: "4",
        title: "Smart Watch Pro",
        subtitle: "Color: Space Gray",
        price: 199.99,
        quantity: 1,
        image: "/placeholder.webp",
      },
      {
        id: "5",
        title: "Mechanical Keyboard",
        subtitle: "Switch: Red",
        price: 159.99,
        quantity: 1,
        image: "/placeholder.webp",
      },
    ],
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    setTimeout(() => {
      setOrders(ordersData)
    }, 400)
  }, [])

  return (
    <div className="min-h-screen bg-[#fafafa] py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h1 className="text-[52px] leading-none font-bold text-black">My Orders</h1>
          <p className="text-[30px] text-[#666] mt-4">Track and manage your orders</p>
        </div>

        <div className="space-y-8">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  )
}