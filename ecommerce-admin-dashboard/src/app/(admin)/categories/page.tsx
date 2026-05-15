"use client";

import React, { useEffect, useState, useCallback } from "react";
import { CategoriesAPI } from "@/src/lib/categories.api";
import CategoryModal from "@/src/components/categories/CategoryModalWrapper";
import Button from "@/src/components/ui/Button";
import toast from "react-hot-toast";
import useCategories from "@/src/store/useCategories";
import CategoryStats from "@/src/components/categories/CategoryStats";
import Breadcrumbs from "@/src/components/categories/Breadcrumbs";
import CategoryTree from "@/src/components/categories/CategoryTree";
import CategoryTable from "@/src/components/categories/CategoryTable";

function TreeNode({ node, depth = 0, onEdit, onCreateChild, onDelete }: any) {
  const [open, setOpen] = useState(true);

  return (
    <div className="pl-2">
      <div className="flex items-center gap-3 py-2">
        <button
          onClick={() => setOpen((s) => !s)}
          className="text-slate-400 hover:text-slate-600"
        >
          {node.children && node.children.length ? (open ? "▾" : "▸") : "·"}
        </button>

        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium">{node.name}</div>
            <div className="text-xs text-slate-400">{node.slug}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => onCreateChild(node)}
            >
              Add
            </button>
            <button
              className="text-sm text-slate-600 hover:underline"
              onClick={() => onEdit(node)}
            >
              Edit
            </button>
            <button
              className="text-sm text-red-600 hover:underline"
              onClick={() => onDelete(node)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {open && node.children && node.children.length > 0 && (
        <div className="pl-6 border-l border-slate-100 dark:border-slate-800">
          {node.children.map((c: any) => (
            <TreeNode
              key={c.id}
              node={c}
              depth={depth + 1}
              onEdit={onEdit}
              onCreateChild={onCreateChild}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const { tree, flat, loading, fetchTree, fetchFlat, refresh } = useCategories();

  const [localLoading, setLocalLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalInitial, setModalInitial] = useState<any>(null);
  const [modalParentId, setModalParentId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLocalLoading(true);
      await Promise.all([fetchTree(), fetchFlat()]);
      setLocalLoading(false);
    })();
  }, [fetchTree, fetchFlat]);

  const openCreate = () => {
    setModalMode("create");
    setModalInitial(null);
    setModalParentId(null);
    setShowModal(true);
  };

  const openCreateChild = (parent: any) => {
    setModalMode("create");
    setModalInitial(null);
    setModalParentId(parent.id);
    setShowModal(true);
  };

  const openEdit = (category: any) => {
    setModalMode("edit");
    setModalInitial(category);
    setModalParentId(category.parentId ?? category.parent?.id ?? null);
    setShowModal(true);
  };

  const handleDelete = async (category: any) => {
    const ok = confirm(`Delete category "${category.name}"? This cannot be undone.`);
    if (!ok) return;
    try {
      await CategoriesAPI.delete(category.id);
      toast.success("Category deleted");
      refresh();
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  const onModalSuccess = () => {
    setShowModal(false);
    refresh();
  };

  const [view, setView] = useState<"tree" | "table">("tree");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [parentFilter, setParentFilter] = useState<string | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "subcategories">("name");

  const filteredFlat = (flat ?? [])
    .filter((c: any) => c.name.toLowerCase().includes(query.toLowerCase()) || c.slug?.toLowerCase().includes(query.toLowerCase()))
    .filter((c: any) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return !!c.isActive;
      return !c.isActive;
    })
    .filter((c: any) => {
      if (parentFilter === "all") return true;
      if (parentFilter === "none") return !c.parentId && !c.parent;
      return c.parentId === parentFilter || c.parent?.id === parentFilter;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      const ac = (a.children?.length ?? 0);
      const bc = (b.children?.length ?? 0);
      return bc - ac;
    });

  const handleReorder = async (orderedIds: any[]) => {
    try {
      await CategoriesAPI.reorder({ orderedIds });
      toast.success("Order saved");
      refresh();
    } catch (e) {
      toast.error("Failed to save order");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <div className="flex items-center gap-3">
          <Button onClick={openCreate}>Create Category</Button>
        </div>
      </div>

      <div className="space-y-4">
        <CategoryStats stats={{ total: (flat ?? []).length, active: (flat ?? []).filter((c:any)=>c.isActive).length, inactive: (flat ?? []).filter((c:any)=>!c.isActive).length, subcategories: (flat ?? []).reduce((s:any,c:any)=>s + (c.children?.length ?? 0), 0) }} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Breadcrumbs items={[{label: 'Dashboard'}, {label: 'Categories'}]} />
          </div>

          <div className="flex items-center gap-3">
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search categories..." className="px-3 py-2 rounded-md border" />

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-md">
              <label className="text-xs text-slate-500">Status</label>
              <select className="px-2 py-1 rounded-md border" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value as any)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <label className="text-xs text-slate-500">Parent</label>
              <select className="px-2 py-1 rounded-md border" value={parentFilter} onChange={(e)=>setParentFilter(e.target.value as any)}>
                <option value="all">All</option>
                <option value="none">No Parent</option>
                {(flat ?? []).filter((f:any)=>!f.parentId && !f.parent).map((root:any)=> (
                  <option key={root.id} value={root.id}>{root.name}</option>
                ))}
              </select>

              <label className="text-xs text-slate-500">Sort</label>
              <select className="px-2 py-1 rounded-md border" value={sortBy} onChange={(e)=>setSortBy(e.target.value as any)}>
                <option value="name">Name</option>
                <option value="subcategories">Subcategories</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={()=>setView('tree')} className={`px-3 py-2 rounded-md ${view==='tree'?'bg-indigo-600 text-white':''}`}>Tree View</button>
              <button onClick={()=>setView('table')} className={`px-3 py-2 rounded-md ${view==='table'?'bg-indigo-600 text-white':''}`}>Table View</button>
            </div>

            <div>
              <Button onClick={()=>{ setModalMode('create'); setModalInitial(null); setModalParentId(parentFilter==='all' || parentFilter==='none'? null : parentFilter); setShowModal(true); }}>Quick Create</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <h3 className="font-medium mb-3">Category Hierarchy</h3>
              {localLoading ? (
                <div className="text-sm text-slate-500">Loading...</div>
              ) : (tree ?? []).length === 0 ? (
                <div className="text-sm text-slate-500">No categories</div>
              ) : (
                <CategoryTree nodes={tree} onEdit={openEdit} onAddChild={openCreateChild} onDelete={handleDelete} onReorder={handleReorder} />
              )}
            </div>
          </div>

          <div className="col-span-7">
            <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <h3 className="font-medium mb-3">All Categories</h3>
              {view === 'table' ? (
                <CategoryTable data={filteredFlat} loading={localLoading} onEdit={openEdit} onAddChild={openCreateChild} onDelete={handleDelete} />
              ) : (
                <CategoryTable data={filteredFlat} loading={localLoading} onEdit={openEdit} onAddChild={openCreateChild} onDelete={handleDelete} />
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <CategoryModal
          mode={modalMode}
          initialData={modalInitial}
          parentId={modalParentId}
          onClose={() => setShowModal(false)}
          onSuccess={onModalSuccess}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={openCreate} className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700">+</button>
      </div>
    </div>
  );
}
