"use client"

import React from "react"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
}

export default function InputField({
  label,
  icon,
  className = "",
  ...props
}: InputFieldProps) {
  return (
    <label className="block relative">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}

      <div className="mt-2 relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        )}

        <input
          {...props}
          className={
            "w-full py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 " +
            (icon ? "pl-11 pr-4" : "px-4") +
            " " +
            className
          }
        />
      </div>
    </label>
  )
}
