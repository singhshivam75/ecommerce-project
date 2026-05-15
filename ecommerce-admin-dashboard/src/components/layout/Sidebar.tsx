"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Boxes, ShoppingCart, Settings, Icon } from "lucide-react";
import React from "react";

const menu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/users", icon: Users },
  { label: "Categories", href: "/categories", icon: Boxes },
  { label: "Products", href: "/products", icon: Boxes },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Settings", href: "/#", icon: Settings },
];

export default function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className={`
  h-screen sticky top-0
  transition-all duration-300
  ${collapsed ? "w-20" : "w-64"}
  bg-gradient-to-b from-slate-900 to-slate-800
  text-white shadow-xl
`}>
      <div className="h-full flex flex-col">

        {/* HEADER */}
        <div className="h-14 flex items-center justify-between px-4 border-b dark:border-slate-800">
          <span className="font-semibold text-slate-200 dark:text-white">
            {collapsed ? "A" : "Admin"}
          </span>

          {/* <button
            onClick={onToggle}
            className="text-xs text-slate-500 hover:text-black dark:hover:text-white"
          >
            {collapsed ? "→" : "←"}
          </button> */}
        </div>

        {/* MENU */}
        <nav className="flex-1 p-2 space-y-1">
          {menu.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
  flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all
  ${active
                    ? "bg-white text-slate-900 font-semibold shadow"
                    : "text-slate-300 hover:bg-white/10"
                  }
`}
              >
                <span className="text-base">
                  {collapsed ? item.label.charAt(0) : "•"}
                </span>
                <item.icon size={16} />

                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-4 text-xs text-slate-400 border-t dark:border-slate-800">
          {!collapsed && "Admin v1.0"}
        </div>
      </div>
    </aside>
  );
}