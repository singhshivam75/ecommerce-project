"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import Button from "../ui/Button";

export default function ProductActions({ product }: any) {
  const [qty, setQty] = useState(1);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({ productId: product.id, quantity: qty });

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="space-y-4">

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <button onClick={() => setQty(q => Math.max(1, q - 1))}>
          <Minus />
        </button>
        <span>{qty}</span>
        <button onClick={() => setQty(q => q + 1)}>
          <Plus />
        </button>
      </div>

      {/* Add to Cart */}
      <Button onClick={addToCart}>
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </Button>
    </div>
  );
}