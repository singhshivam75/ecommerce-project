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
  const toggleStatus = async (id: number) => {
    try {
      await ProductsAPI.toggle(id);
      toast.success("Updated");
      refetch();
    } catch {
      toast.error("Failed");
    }
  };

  // 🔹 Columns
  const columns = [
    {
      key: "product",
      title: "Product",
      className: "col-span-4",
      render: (p: any) => {
        const image = p.images?.find((i: any) => i.isPrimary)?.url;

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
              {image && (
                <img src={image} className="w-full h-full object-cover" />
              )}
            </div>

            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-gray-400">
                {p.variants?.length || 0} variants
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "basePrice",
      title: "Price",
      className: "col-span-2",
      render: (p: any) => `₹${p.basePrice}`,
    },
    {
      key: "category",
      title: "Category",
      className: "col-span-2",
      render: (p: any) => p.category?.name,
    },
    {
      key: "status",
      title: "Status",
      className: "col-span-2",
      render: (p: any) => (
        <button
          onClick={() => toggleStatus(p.id)}
          className={`px-3 py-1 text-xs rounded ${
            p.isActive
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {p.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      className: "col-span-2 text-right",
      render: (p: any) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => router.push(`/products/edit/${p.id}`)}
            className="px-2 py-1 bg-gray-100 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => router.push(`/products/${p.id}/variants`)}
            className="px-2 py-1 bg-purple-100 text-purple-600 rounded"
          >
            Variants
          </button>

          <button
            onClick={() => setDeleteId(p.id)}
            className="px-2 py-1 bg-red-100 text-red-600 rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      <PageHeader
        title="Products"
        subtitle="Manage your products"
        actions={
          <Button onClick={() => router.push("/products/create")}>
            + Create
          </Button>
        }
      />

      <TableSearch value={searchInput} onChange={setSearchInput} />

      <DataTable columns={columns} data={products} loading={loading} />

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