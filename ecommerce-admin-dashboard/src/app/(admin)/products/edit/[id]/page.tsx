"use client";

import { useParams } from "next/navigation";
import { useFetch } from "../../../../../hooks/useFetch";
import ProductForm from "../../../../../components/product/ProductForm";

export default function EditPage() {
  const { id } = useParams();
  const pid = Array.isArray(id) ? id[0] : id;
  const { data, loading } = useFetch(pid ? `/products/${pid}` : null, [pid]);

  if (loading) return <p>Loading...</p>;

  // `useFetch` returns `res.data` from the API. Some API responses wrap the
  // payload under `data` (e.g. { success: true, data: { ... } }). Unwrap here
  // to ensure `ProductForm` always receives the actual product object.
  const product = data?.data || data;

  return <ProductForm product={product} isEdit={true} />;
}