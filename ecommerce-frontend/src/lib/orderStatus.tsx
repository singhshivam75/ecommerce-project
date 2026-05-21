"use client"

import React from "react"
import { CheckCircle2, Clock3, Truck } from "lucide-react"

export type OrderStatus = "Delivered" | "Shipped" | "Processing"

export const statusStyles: Record<OrderStatus, string> = {
  Delivered: "bg-emerald-50 text-emerald-600",
  Shipped: "bg-blue-50 text-blue-600",
  Processing: "bg-amber-50 text-amber-600",
}

export const statusIcons: Record<OrderStatus, React.ReactNode> = {
  Delivered: <CheckCircle2 size={18} />,
  Shipped: <Truck size={18} />,
  Processing: <Clock3 size={18} />,
}
