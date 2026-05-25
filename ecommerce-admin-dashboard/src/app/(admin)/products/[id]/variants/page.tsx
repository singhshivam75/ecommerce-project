"use client";

import { useParams } from "next/navigation";
import VariantManager from "../../../../../components/product/variants/VariantManager";

export default function ProductVariantsPage() {
  const { id } = useParams();
  const pid = Array.isArray(id) ? id[0] : id;

  return (
    <div className="p-6">
      <VariantManager productId={pid} />
    </div>
  );
}