"use client"

import Image from "next/image"
import React from "react"

interface OrderItemProps {
  id: string
  title: string
  subtitle?: string
  price: number
  quantity: number
  image: string
  isLast?: boolean
}

export default function OrderItem({ id, title, subtitle, price, quantity, image, isLast }: OrderItemProps) {
  return (
    <div className="flex items-start gap-6">
      <div className="flex flex-col items-center pt-3">
        <div className="w-5 h-5 rounded-full border-[5px] border-blue-500 bg-white" />

        {!isLast && <div className="w-[2px] h-28 bg-blue-200" />}
      </div>

      <div className="flex flex-1 items-center gap-5">
        <div className="w-[110px] h-[110px] rounded-[22px] overflow-hidden bg-[#f5f5f5] flex-shrink-0">
          <Image src={image} alt={title} width={100} height={100} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1">
          <h3 className="text-[20px] leading-tight font-semibold text-black">{title}</h3>
          {subtitle && <p className="text-[15px] text-[#666] mt-2">{subtitle}</p>}

          <div className="flex items-center gap-3 mt-4">
            <span className="text-[20px] font-bold">${price.toFixed(2)}</span>
            <span className="text-[#888] text-[20px]">×</span>
            <span className="text-[#666] text-[20px]">{quantity}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
