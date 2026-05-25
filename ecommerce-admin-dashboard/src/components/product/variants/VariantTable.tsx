import React, { useCallback, useMemo, useState } from "react";
import VariantRow from "./VariantRow";
import { VariantCombination } from "./types";
import toast from "react-hot-toast";

type SetLike = Set<number>;

type Props = {
  productId?: string;
  variants: VariantCombination[];
  loading?: boolean;
  setLocalVariant: (idx: number, patch: Partial<VariantCombination>) => void;
  saveVariant: (idx: number) => Promise<void>;
  deleteVariant: (idx: number) => Promise<void>;
  refresh: () => Promise<void>;
  dirtyRows: SetLike;
  savingRows: SetLike;
  saveAllDirty?: () => Promise<{ success: number; failed: number }>;
  cancelEdit: (idx: number) => void;
  isDirty: (idx: number) => boolean;
};

export default function VariantTable(props: Props) {
  const { productId, variants, loading, setLocalVariant, saveVariant, deleteVariant, refresh, dirtyRows, savingRows, saveAllDirty, cancelEdit, isDirty } = props;

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const handleChange = useCallback((idx: number, patch: Partial<VariantCombination>) => {
    setLocalVariant(idx, patch);
  }, [setLocalVariant]);

  const allSelected = useMemo(() => variants.length > 0 && selected.size === variants.length, [selected, variants.length]);

  const toggleSelectAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === variants.length) return new Set();
      return new Set(variants.map((_, i) => i));
    });
  }, [variants]);

  const toggleSelect = useCallback((i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }, []);

  const handleBulkSave = useCallback(async () => {
    const toSave = Array.from(selected).filter((i) => dirtyRows.has(i));
    if (!toSave.length) {
      toast('No dirty rows selected');
      return;
    }
    setBulkLoading(true);
    const results = await Promise.allSettled(toSave.map((i) => saveVariant(i)));
    setBulkLoading(false);
    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - success;
    toast.success(`${success} variants saved, ${failed} failed`);
  }, [selected, dirtyRows, saveVariant]);

  const handleBulkDelete = useCallback(async () => {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} selected variants? This cannot be undone.`)) return;
    setBulkLoading(true);
    const indices = Array.from(selected).sort((a,b)=>b-a); // delete from highest to avoid index shifts
    const results = await Promise.allSettled(indices.map((i) => deleteVariant(i)));
    setBulkLoading(false);
    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - success;
    setSelected(new Set());
    toast.success(`${success} variants deleted, ${failed} failed`);
  }, [selected, deleteVariant]);

  return (
    <div className="bg-white rounded border overflow-auto">
      <div className="p-3 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input aria-label="Select all" type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
            <span className="text-sm">Select all</span>
          </label>
          <button className="btn-sm" onClick={handleBulkSave} disabled={bulkLoading}>{bulkLoading ? 'Saving...' : 'Save Selected'}</button>
          <button className="btn-sm text-red-600" onClick={handleBulkDelete} disabled={bulkLoading}>{bulkLoading ? 'Deleting...' : 'Delete Selected'}</button>
        </div>
        <div className="text-sm text-gray-600">{variants.length} variants</div>
      </div>

      <table className="w-full text-sm table-fixed">
        <thead className="sticky top-12 bg-gray-50">
          <tr>
            <th className="p-2 w-12"></th>
            <th className="p-2">Image</th>
            <th className="p-2">SKU</th>
            <th className="p-2">Variant</th>
            <th className="p-2">Price</th>
            <th className="p-2">Compare</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Reserved</th>
            <th className="p-2">Active</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <tr key={`skeleton-${i}`} className="animate-pulse">
              <td className="p-3"><div className="h-4 w-4 bg-gray-200 rounded" /></td>
              <td className="p-3"><div className="h-10 w-10 bg-gray-200 rounded" /></td>
              <td className="p-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
              <td className="p-3"><div className="h-4 bg-gray-200 rounded w-48" /></td>
              <td className="p-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
              <td className="p-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
              <td className="p-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
              <td className="p-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
              <td className="p-3"><div className="h-4 bg-gray-200 rounded w-8" /></td>
              <td className="p-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
              <td className="p-3"><div className="h-4 bg-gray-200 rounded w-32" /></td>
            </tr>
          ))}

          {!loading && variants.length === 0 && (
            <tr><td colSpan={11} className="p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">🏷️</div>
                <div className="text-lg font-medium">No variants generated yet</div>
                <div className="text-sm text-gray-600">Create option groups and generate product variants.</div>
                <div className="pt-2"><button className="btn" onClick={refresh}>Refresh</button></div>
              </div>
            </td></tr>
          )}

          {!loading && variants.map((v, i) => (
            <VariantRow
              key={v.id || i}
              variant={v}
              index={i}
              selected={selected.has(i)}
              onSelect={() => toggleSelect(i)}
              dirty={dirtyRows.has(i)}
              saving={savingRows.has(i)}
              onChange={handleChange}
              onSave={() => saveVariant(i)}
              onCancel={() => cancelEdit(i)}
              onDelete={() => deleteVariant(i)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
