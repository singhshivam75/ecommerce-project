"use client"

import React from "react"

export default function AuthLayout({
  left,
  children,
}: {
  left?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-stretch bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white p-12">
        <div className="max-w-md">{left}</div>
      </div>

      <div className="lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
