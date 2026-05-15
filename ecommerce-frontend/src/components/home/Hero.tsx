"use client";

import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')"></div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">
              Summer Sale - Limited Time Only
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Discover Your
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Perfect Style
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Experience premium quality products with up to 50% off.
            Free shipping on orders over $50.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button variant="accent" size="lg">
                Shop Collection
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Explore Deals
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
}