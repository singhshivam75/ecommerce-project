"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductsAPI } from "../../../../lib/products.api";
import { Variant as AppVariant } from "../../../../types/variant";
import { VariantCombination } from "../types";
import { attributesToObject, objectToAttributes } from "../../../../utils/attributes";
import toast from "react-hot-toast";

type HookResult = {
  variants: VariantCombination[];
  loading: boolean;
  savingRows: Set<number>;
  dirtyRows: Set<number>;
  error?: unknown;

  setLocalVariant: (idx: number, patch: Partial<VariantCombination>) => void;
  saveVariant: (idx: number) => Promise<void>;
  saveAllDirty: () => Promise<{ success: number; failed: number }>;
  cancelEdit: (idx: number) => void;
  deleteVariant: (idx: number, confirm?: boolean) => Promise<void>;
  addManualVariant: (v?: Partial<VariantCombination>) => void;
  addVariantsBulk: (combinations: VariantCombination[]) => void;
  refresh: () => Promise<void>;
  isDirty: (idx: number) => boolean;
};

function deepEqual(a: unknown, b: unknown): boolean {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch (e) {
    return false;
  }
}

export function useVariants(productId?: string): HookResult {
  const [variants, setVariants] = useState<VariantCombination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // track saving rows and dirty rows as stateful Sets (immutable updates)
  const [savingRows, setSavingRows] = useState<Set<number>>(new Set());
  const [dirtyRows, setDirtyRows] = useState<Set<number>>(new Set());

  // original snapshot to support cancel/rollback. Keep as ref to avoid re-renders.
  const origRef = useRef<VariantCombination[]>([]);

  const fetch = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res: any = await ProductsAPI.getById(productId);
      const data = res?.data?.variants ?? res?.data?.product?.variants ?? [];
      // normalize: ensure attributes is object
      const mapped: VariantCombination[] = (data as AppVariant[]).map((v) => ({
        id: v.id ? String(v.id) : undefined,
        sku: v.sku ?? '',
        attributes: (v.attributes as Record<string, string>) ?? {},
        price: v.price ?? 0,
        compareAtPrice: v.compareAtPrice ?? 0,
        stock: v.stock ?? 0,
        reservedStock: v.reservedStock ?? 0,
        isActive: !!v.isActive,
        isDefault: !!v.isDefault,
        barcode: v.barcode,
        costPrice: v.costPrice,
        thumbnail: v.thumbnail,
        productId: v.productId ? String(v.productId) : productId,
      }));

      setVariants(mapped);
      origRef.current = mapped.map((m) => JSON.parse(JSON.stringify(m)));
      setDirtyRows(new Set());
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const setLocalVariant = useCallback((idx: number, patch: Partial<VariantCombination>) => {
    setVariants((prev) => {
      if (idx < 0 || idx >= prev.length) return prev;
      const copy = prev.slice();
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });

    setDirtyRows((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  const isDirty = useCallback((idx: number) => dirtyRows.has(idx), [dirtyRows]);

  const saveVariant = useCallback(async (idx: number) => {
    if (idx < 0 || idx >= variants.length) return;
    const current = variants[idx];
    const prevSnapshot = origRef.current[idx] ? JSON.parse(JSON.stringify(origRef.current[idx])) : undefined;

    // prepare payload
    const payload = {
      sku: current.sku,
      attributes: current.attributes ?? {},
      price: current.price ?? 0,
      compareAtPrice: current.compareAtPrice ?? 0,
      stock: current.stock ?? 0,
      reservedStock: current.reservedStock ?? 0,
      isActive: !!current.isActive,
      isDefault: !!current.isDefault,
      barcode: current.barcode,
      costPrice: current.costPrice,
      thumbnail: current.thumbnail,
      productId: current.productId ?? productId,
    } as any;

    setSavingRows((s) => new Set(s).add(idx));

    // optimistic: nothing to change in UI because edits are already local
    try {
      if (current.id) {
        await ProductsAPI.updateVariant(current.id, payload);
      } else {
        if (!productId) throw new Error("Missing productId");
        const res: any = await ProductsAPI.addVariant({ ...payload });
        if (res?.data?.id) {
          // attach new id
          setVariants((prev) => {
            const copy = prev.slice();
            copy[idx] = { ...copy[idx], id: String(res.data.id) };
            return copy;
          });
        }
      }

      // on success, update orig snapshot and clear dirty flag
      origRef.current[idx] = JSON.parse(JSON.stringify(variants[idx]));
      setDirtyRows((s) => {
        const next = new Set(s);
        next.delete(idx);
        return next;
      });
      toast.success('Saved');
    } catch (err) {
      // rollback
      setVariants((prev) => {
        const copy = prev.slice();
        if (prevSnapshot) copy[idx] = prevSnapshot as VariantCombination;
        return copy;
      });
      setError(err);
      toast.error('Save failed');
      throw err;
    } finally {
      setSavingRows((s) => {
        const next = new Set(s);
        next.delete(idx);
        return next;
      });
    }
  }, [productId, variants]);

  const saveAllDirty = useCallback(async () => {
    const indices = Array.from(dirtyRows.values());
    if (!indices.length) return { success: 0, failed: 0 };

    setLoading(true);
    const results = await Promise.allSettled(indices.map((idx) => saveVariant(idx)));
    setLoading(false);

    let success = 0;
    let failed = 0;
    results.forEach((r) => (r.status === 'fulfilled' ? success++ : failed++));
    toast.success(`${success} saved, ${failed} failed`);
    return { success, failed };
  }, [dirtyRows, saveVariant]);

  const cancelEdit = useCallback((idx: number) => {
    setVariants((prev) => {
      const copy = prev.slice();
      const original = origRef.current[idx];
      if (original) {
        copy[idx] = JSON.parse(JSON.stringify(original));
      } else {
        // original didn't exist — remove this new unsaved variant
        copy.splice(idx, 1);
      }
      return copy;
    });
    setDirtyRows((s) => {
      const next = new Set(s);
      next.delete(idx);
      return next;
    });
  }, []);

  const deleteVariant = useCallback(async (idx: number, confirm = true) => {
    if (idx < 0 || idx >= variants.length) return;
    const item = variants[idx];
    const prev = variants.slice();

    // optimistic remove
    setVariants((prevV) => prevV.filter((_, i) => i !== idx));
    // adjust origRef
    const savedOrig = origRef.current.slice();
    savedOrig.splice(idx, 1);
    origRef.current = savedOrig;
    setDirtyRows((s) => {
      const next = new Set(Array.from(s).filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i)));
      return next;
    });

    if (!item.id) {
      toast.success('Deleted');
      return;
    }

    try {
      await ProductsAPI.deleteVariant(item.id);
      toast.success('Deleted');
    } catch (err) {
      // rollback
      setVariants(prev);
      origRef.current = savedOrig; // restore
      setError(err);
      toast.error('Delete failed');
      throw err;
    }
  }, [variants]);

  const addManualVariant = useCallback((v?: Partial<VariantCombination>) => {
    const newVar: VariantCombination = {
      id: undefined,
      sku: v?.sku ?? '',
      attributes: v?.attributes ?? {},
      price: v?.price ?? 0,
      compareAtPrice: v?.compareAtPrice ?? 0,
      stock: v?.stock ?? 0,
      reservedStock: v?.reservedStock ?? 0,
      isActive: v?.isActive ?? true,
      isDefault: v?.isDefault ?? false,
      barcode: v?.barcode,
      costPrice: v?.costPrice,
      thumbnail: v?.thumbnail,
      productId: productId,
    };
    setVariants((prev) => [...prev, newVar]);
    origRef.current = [...origRef.current, undefined as any];
    setDirtyRows((s) => {
      const next = new Set(s);
      next.add(variants.length);
      return next;
    });
  }, [productId, variants.length]);

  const addVariantsBulk = useCallback((combinations: VariantCombination[]) => {
    // Add combinations locally and mark them dirty for later save
    const toAdd = combinations.map((c) => ({ ...c, id: undefined, productId }));
    setVariants((prev) => {
      const next = [...prev, ...toAdd];
      // extend origRef with placeholders
      origRef.current = [...origRef.current, ...toAdd.map(() => undefined as any)];
      return next;
    });
    setDirtyRows((s) => {
      const next = new Set(s);
      const start = variants.length;
      for (let i = 0; i < combinations.length; i++) next.add(start + i);
      return next;
    });
  }, [productId, variants.length]);

  const refresh = useCallback(async () => {
    await fetch();
  }, [fetch]);

  return useMemo(() => ({
    variants,
    loading,
    savingRows,
    dirtyRows,
    error,
    setLocalVariant,
    saveVariant,
    saveAllDirty,
    cancelEdit,
    deleteVariant,
    addManualVariant,
    addVariantsBulk,
    refresh,
    isDirty,
  }), [variants, loading, savingRows, dirtyRows, error, setLocalVariant, saveVariant, saveAllDirty, cancelEdit, deleteVariant, addManualVariant, addVariantsBulk, refresh, isDirty]);
}

export default useVariants;
