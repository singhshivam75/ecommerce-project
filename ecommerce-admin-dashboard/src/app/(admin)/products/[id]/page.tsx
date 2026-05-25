"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "../../../../hooks/useFetch";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Badge from "@/src/components/ui/Badge";
import PageHeader from "@/src/components/ui/PageHeader";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import ImagePreviewModal from "@/src/components/ui/ImagePreviewModal";
import { ProductsAPI } from "@/src/lib/products.api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const pid = Array.isArray(id) ? id[0] : id; // keep as string (supports UUIDs)

  const { data, loading } = useFetch(pid ? `/products/${pid}` : null, [pid]);
  const product = data?.data || data?.product || data || null;

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await ProductsAPI.delete(deleteId as any);
      router.push('/products');
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 h-64 bg-slate-200 rounded" />
            <div className="h-64 bg-slate-200 rounded" />
          </div>
          <div className="h-40 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <PageHeader title="Product not found" subtitle="This product does not exist or was removed." />
      </div>
    );
  }

  const image = product.images?.find((i: any) => i.isPrimary)?.url || product.images?.[0]?.url;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <PageHeader
        title={product.title}
        subtitle={product.category?.name || ''}
          actions={<div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => router.push(`/products/edit/${product.id}`)}>Edit</Button>
          <Button variant="ghost" onClick={() => router.push(`/products/${product.id}/variants`)}>Variants</Button>
          <Button variant="danger" onClick={() => setDeleteId(String(product.id))}>Delete</Button>
        </div>}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <div className="flex flex-col gap-4">
              <div className="w-full bg-slate-50 rounded-lg overflow-hidden">
                {image ? (
                  <img src={image} alt={product.title} className="w-full h-96 object-cover rounded-md" />
                ) : (
                  <div className="h-96 flex items-center justify-center text-slate-400">No image</div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-3 overflow-x-auto">
                {product.images?.length ? (
                  product.images.map((img:any, i:number)=> (
                    <button key={img.id || img.url || i} onClick={()=>setPreviewSrc(img.url)} className="shrink-0 rounded-lg overflow-hidden border border-slate-100">
                      <img src={img.url} alt={img.alt||product.title} className="h-20 w-28 object-cover" />
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">No images available</div>
                )}
              </div>
              <div className="prose max-w-none text-slate-700">
                <div dangerouslySetInnerHTML={{ __html: product.description || '<em>No description</em>' }} />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Card>
              <h3 className="text-sm font-semibold text-slate-700">Specifications</h3>
              <div className="mt-3 text-sm text-slate-600">
                {product.specifications?.length ? (
                  <ul className="list-disc pl-5">
                    {product.specifications.map((s:any)=> (<li key={s.id || s.key}>{s.key}: {s.value}</li>))}
                  </ul>
                ) : (
                  <div className="text-sm text-slate-500">No specifications added.</div>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-slate-700">Variants</h3>
              <div className="mt-3 text-sm text-slate-600">
                <div>{product.variants?.length || 0} variants</div>
                <div className="mt-2">
                  {product.variants?.slice(0,5).map((v:any)=> (
                    <div key={v.id} className="flex items-center justify-between py-2">
                      <div className="text-sm">{v.title || v.sku}</div>
                      <div className="text-sm text-slate-500">₹{v.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-semibold">₹{product.basePrice}</div>
                  <div className="text-sm text-slate-500">SKU: {product.sku || '—'}</div>
                </div>
                <div>
                  {(() => {
                    if (product.status === 'published') return <Badge variant="emerald">Active</Badge>;
                    if (product.status === 'draft') return <Badge variant="slate">Draft</Badge>;
                    if (product.status === 'archived') return <Badge variant="rose">Archived</Badge>;
                    return <Badge variant="orange">Out of Stock</Badge>;
                  })()}
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <div><strong>Category:</strong> {product.category?.name || '—'}</div>
                <div className="mt-2"><strong>Stock:</strong> {product.stock ?? '—'}</div>
                <div className="mt-2"><strong>Tags:</strong> {product.tags?.join(', ') || '—'}</div>
              </div>

              <div className="pt-2">
                <Button variant="primary" onClick={()=>router.push(`/products/edit/${product.id}`)}>Edit product</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ImagePreviewModal open={!!previewSrc} src={previewSrc ?? undefined} alt={product.title} onClose={()=>setPreviewSrc(null)} />

      {deleteId !== null && (
        <ConfirmModal open title="Delete Product" message="Are you sure you want to delete this product?" onConfirm={confirmDelete} onCancel={()=>setDeleteId(null)} loading={deleting} />
      )}
    </div>
  );
}
