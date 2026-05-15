"use client";

import { Sparkles } from "lucide-react";
import Button from "../ui/Button";

export default function NewsletterSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')"></div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium">
            Join 50,000+ Happy Subscribers
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          Stay in the Loop
        </h2>

        {/* Description */}
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Get exclusive deals, new arrivals, and personalized style tips delivered to your inbox.
        </p>

        {/* Input + Button */}
        <div className="max-w-md mx-auto flex gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none transition"
          />

          <Button variant="accent" size="lg">
            Subscribe
          </Button>
        </div>

        {/* Footer text */}
        <p className="text-sm text-gray-400 mt-4">
          Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}