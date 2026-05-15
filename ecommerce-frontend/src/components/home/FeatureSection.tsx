"use client";

import { Truck, Shield, RotateCcw, Zap } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Item 1 */}
        <div className="text-center group">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition">
            <Truck className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Free Shipping
          </h3>
          <p className="text-gray-500">
            On orders over $50
          </p>
        </div>

        {/* Item 2 */}
        <div className="text-center group">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Secure Payment
          </h3>
          <p className="text-gray-500">
            100% secure transactions
          </p>
        </div>

        {/* Item 3 */}
        <div className="text-center group">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition">
            <RotateCcw className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Easy Returns
          </h3>
          <p className="text-gray-500">
            30-day return policy
          </p>
        </div>

        {/* Item 4 */}
        <div className="text-center group">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Fast Delivery
          </h3>
          <p className="text-gray-500">
            2–3 business days
          </p>
        </div>

      </div>
    </section>
  );
}