"use client";

import React, { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import toast from "react-hot-toast";
import { ProductsAPI } from "../../../lib/products.api";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { useRouter } from "next/navigation";

import TablePagination from "@/src/components/table/TablePagination";
import TableSearch from "@/src/components/table/TableSearch";
import DataTable from "@/src/components/table/DataTable";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import Badge from "@/src/components/ui/Badge";
import { Edit3, Trash2, Eye, Layers } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: categoriesData } = useFetch('/categories');
  const categories = categoriesData?.data || categoriesData || [];
  const [filters, setFilters] = useState({ category: '', status: '', featured: false, stock: '' });

  // 🔹 API
  const { data, loading, refetch } = useFetch(
    `/products?page=${query.page}&limit=${query.limit}&search=${query.search}`
  );

  const products = data?.data || [];
  const meta = data?.meta;

  // 🔹 Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        search: searchInput,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(delay);
  }, [searchInput]);

  // 🔹 Delete
  const confirmDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await ProductsAPI.delete(deleteId);
      toast.success("Deleted");
      setDeleteId(null);
      refetch();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // 🔹 Toggle
  const toggleStatus = async (id: number, currentStatus?: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await ProductsAPI.update(id, { status: newStatus } as any);
      toast.success("Updated");
      refetch();
    } catch {
      toast.error("Failed");
    }
  };

  // bulk helpers
  const onToggleSelect = (id: number) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const onToggleSelectAll = (checked: boolean) => setSelectedIds(checked ? products.map((p: any) => p.id) : []);

  const bulkDelete = async () => {
    if (!selectedIds.length) return;
    try {
      // optimistic remove
      // remove locally by refetch after
      for (const id of selectedIds) {
        await ProductsAPI.delete(id);
      }
      toast.success('Deleted');
      setSelectedIds([]);
      refetch();
    } catch { console.error('bulk delete failed'); toast.error('Bulk delete failed'); }
  };

  const bulkPublish = async () => {
    if (!selectedIds.length) return;
    try {
      for (const id of selectedIds) {
        await ProductsAPI.update(id, { status: 'published' } as any);
      }
      toast.success('Published'); refetch(); setSelectedIds([]);
    } catch { toast.error('Bulk publish failed'); }
  };

  const bulkFeature = async () => {
    if (!selectedIds.length) return;
    try {
      for (const id of selectedIds) {
        await ProductsAPI.update(id, { featured: true });
      }
      toast.success('Featured'); refetch(); setSelectedIds([]);
    } catch { toast.error('Bulk feature failed'); }
  };

  // 🔹 Columns
  const columns = [
    {
      key: "product",
      title: "Product",
      className: "col-span-4 flex items-center",
      render: (p: any) => {
        const image =
          p.images?.find((i: any) => i.isPrimary)?.url;

        return (
          <div className="flex items-center gap-2 w-full">

            <div className="
        w-16 h-16
        rounded-2xl
        overflow-hidden
        border border-slate-200
        bg-slate-100
        shrink-0
      ">
              {image ? (
                <img
                  src={image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  📦
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="
          font-semibold
          text-slate-800
          truncate
        ">
                {p.title}
              </div>

              <div className="
          flex items-center gap-3
          mt-1 text-xs text-slate-500
        ">
                <span>
                  {p.variants?.length || 0} variants
                </span>

                {p.featured && (
                  <Badge variant="violet">
                    Featured
                  </Badge>
                )}

                {p.onSale && (
                  <Badge variant="rose">
                    Sale
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "basePrice",
      title: "Price",
      className: "col-span-2 flex items-center",
      render: (p: any) => `₹${p.basePrice}`,
    },
    {
      key: "category",
      title: "Category",
      className: "col-span-2 flex items-center",
      render: (p: any) => p.category?.name,
    },
    {
      key: "status",
      title: "Status",
      className: "col-span-1 flex items-center",
      render: (p: any) => {
        const statusBadge = (() => {
          if (p.status === 'published') return <Badge variant="emerald">Active</Badge>;
          if (p.status === 'draft') return <Badge variant="slate">Draft</Badge>;
          if (p.status === 'archived') return <Badge variant="rose">Archived</Badge>;
          return <Badge variant="orange">Out of Stock</Badge>;
        })();

        return (
          <div className="flex items-center">
            <button onClick={() => toggleStatus(p.id, p.status)} className="mr-2">
              {statusBadge}
            </button>
          </div>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      className: "col-span-2 flex items-center justify-end whitespace-nowrap",
      render: (p: any) => (
        <div className="flex items-center justify-end gap-2 flex-nowrap">
          <button
            title="View product"
            onClick={() => router.push(`/products/${p.id}`)}
            className="
inline-flex items-center justify-center
h-10 w-10 rounded-xl
border border-slate-200
bg-white
text-slate-500
shadow-sm
hover:bg-indigo-50
hover:text-indigo-600
hover:border-indigo-200
transition-all duration-200
"
          >
            <Eye size={16} />
          </button>

          <button
            title="Edit product"
            onClick={() => router.push(`/products/edit/${p.id}`)}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-100 bg-white text-slate-600 hover:bg-slate-50 transition"
          >
            <Edit3 size={16} />
          </button>

          <button
            title="Variants"
            onClick={() => router.push(`/products/${p.id}/variants`)}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-100 bg-white text-slate-600 hover:bg-slate-50 transition"
          >
            <Layers size={16} />
          </button>

          <button
            title="Delete product"
            onClick={() => setDeleteId(p.id)}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">

      <PageHeader
        title="Products"
        subtitle="Manage your products"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={() => router.push("/products/create")}>+ Create</Button>
            {selectedIds.length > 0 && (
              <div className="flex gap-2">
                <Button variant="danger" onClick={bulkDelete}>Delete ({selectedIds.length})</Button>
                <Button variant="secondary" onClick={bulkPublish}>Publish</Button>
                <Button variant="secondary" onClick={bulkFeature}>Feature</Button>
              </div>
            )}
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 min-w-0">
          <TableSearch value={searchInput} onChange={setSearchInput} />
        </div>

        <select className="h-11 rounded-xl border border-slate-200 bg-white shadow-sm px-3 text-sm outline-none transition-all duration-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500" value={filters.category} onChange={(e) => { setFilters(prev => ({ ...prev, category: e.target.value })); setQuery(prev => ({ ...prev, page: 1 })) }}>
          <option value="">All categories</option>
          {categories.map((c: any) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <select className="h-11 rounded-xl border border-slate-200 bg-white shadow-sm px-3 text-sm outline-none transition-all duration-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500" value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
          <option value="">All status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
          <option value="out_of_stock">Out Of Stock</option>
        </select>
      </div>

      <DataTable columns={columns} data={products} loading={loading} selectable selectedIds={selectedIds} onToggleSelect={onToggleSelect} onToggleSelectAll={onToggleSelectAll} />

      <TablePagination
        page={meta?.page || 1}
        totalPages={meta?.totalPages || 1}
        onChange={(page: number) =>
          setQuery((prev) => ({ ...prev, page }))
        }
      />

      {deleteId && (
        <ConfirmModal
          open
          title="Delete Product"
          message="Are you sure?"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}