"use client";

import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // cart count
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
      setCartCount(count);
    };

    updateCart();
    window.addEventListener("storage", updateCart);

    return () => window.removeEventListener("storage", updateCart);
  }, []);

  // scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navbar */}
        <div className="flex items-center justify-between h-20">
          
          {/* Logo + Nav */}
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ShopHub</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/products" className="nav-link">
                Products
              </Link>
              <Link href="/orders" className="nav-link">
                Orders
              </Link>
            </nav>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-8 hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            
            <Link href="/wishlist" className="hidden sm:flex icon-btn">
              <Heart className="w-5 h-5 group-hover:text-red-500 group-hover:fill-red-500" />
            </Link>

            <Link href="/auth/login" className="hidden sm:flex icon-btn">
              <User className="w-5 h-5" />
            </Link>

            <Link href="/cart" className="relative icon-btn">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </Link>

            <button className="md:hidden icon-btn">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
}