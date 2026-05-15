"use client";

import { useParams } from "next/navigation";
import { useFetch } from "../../../../../hooks/useFetch";
import ProductForm from "../../../../../components/product/ProductForm";

export default function EditPage() {
  const { id } = useParams();
  const { data, loading } = useFetch(`/products/${id}`);

  if (loading) return <p>Loading...</p>;

  return <ProductForm product={data} isEdit={true} />;
}