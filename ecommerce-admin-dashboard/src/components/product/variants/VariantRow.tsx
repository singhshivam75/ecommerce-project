"use client";

import React, { useEffect, useMemo, useState } from "react";
import { VariantCombination } from "./types";
import { attributesToDisplay } from "../../../utils/attributes";

type Props = {
  variant: VariantCombination;
  index: number;
  selected?: boolean;
  onSelect?: () => void;
  dirty?: boolean;
  saving?: boolean;
  onChange: (idx: number, patch: Partial<VariantCombination>) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
  onDelete: () => Promise<void>;
};

function VariantRowInner({ variant, index, selected = false, onSelect, dirty = false, saving = false, onChange, onSave, onCancel, onDelete }: Props) {
  const [localStatus, setLocalStatus] = useState<'idle'|'saving'|'saved'|'failed'>('idle');
  const [error, setError] = useState<string | null>(null);

  const displayAttrs = useMemo(() => attributesToDisplay(variant.attributes), [variant.attributes]);

  useEffect(() => {
    if (saving) setLocalStatus('saving');
    else if (!dirty && !saving) {
      // saved
      setLocalStatus('saved');
      const t = setTimeout(() => setLocalStatus('idle'), 1500);
      return () => clearTimeout(t);
    } else if (dirty && !saving) {
      setLocalStatus('idle');
    }
  }, [dirty, saving]);

  const handleSave = async () => {
    setError(null);
    setLocalStatus('saving');
    try {
      await onSave();
      setLocalStatus('saved');
    } catch (err: any) {
      setLocalStatus('failed');
      setError(err?.message || 'Save failed');
    }
  };

  const handleCancel = () => {
    onCancel();
    setError(null);
    setLocalStatus('idle');
  };

  return (
    <tr className={`border-t transition-colors ${dirty ? 'bg-yellow-50' : ''}`}>
      <td className="p-2">
        <input aria-label={`Select variant ${index+1}`} type="checkbox" checked={selected} onChange={onSelect} />
      </td>
      <td className="p-2 w-20">
        <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden">
          {variant.thumbnail ? <img src={variant.thumbnail} alt="" className="w-full h-full object-cover" /> : null}
        </div>
      </td>
      <td className="p-2">
        <div className="flex items-center gap-2">
          {dirty ? <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" aria-hidden /> : null}
          <input aria-label={`SKU ${index+1}`} className="input" value={variant.sku || ''} onChange={(e)=>onChange(index,{ sku: e.target.value })} />
        </div>
      </td>
      <td className="p-2">{displayAttrs}</td>
      <td className="p-2"><input aria-label={`Price ${index+1}`} type="number" className="input w-32" value={variant.price ?? 0} onChange={(e)=>onChange(index,{ price: Number(e.target.value) })} /></td>
      <td className="p-2"><input aria-label={`Compare price ${index+1}`} type="number" className="input w-32" value={variant.compareAtPrice ?? 0} onChange={(e)=>onChange(index,{ compareAtPrice: Number(e.target.value) })} /></td>
      <td className="p-2"><input aria-label={`Stock ${index+1}`} type="number" className="input w-24" value={variant.stock ?? 0} onChange={(e)=>onChange(index,{ stock: Number(e.target.value) })} /></td>
      <td className="p-2"><input aria-label={`Reserved stock ${index+1}`} type="number" className="input w-24" value={variant.reservedStock ?? 0} onChange={(e)=>onChange(index,{ reservedStock: Number(e.target.value) })} /></td>
      <td className="p-2">
        <label className="flex items-center gap-2">
          <input aria-label={`Active ${index+1}`} type="checkbox" checked={!!variant.isActive} onChange={(e)=>onChange(index,{ isActive: e.target.checked })} />
        </label>
      </td>
      <td className="p-2">
        {variant.isDefault ? <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Default</span> : <span className={`inline-block px-2 py-1 text-xs rounded ${variant.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{variant.isActive ? 'Active' : 'Inactive'}</span>}
      </td>
      <td className="p-2">
        <div className="flex gap-2 items-center">
          <button className="btn-sm" onClick={handleSave} disabled={!dirty || saving}>{saving ? 'Saving...' : localStatus === 'saved' ? '✓ Saved' : localStatus === 'failed' ? 'Retry' : 'Save'}</button>
          <button className="btn-sm" onClick={handleCancel} disabled={!dirty || saving}>Cancel</button>
          <button className="text-red-500" onClick={async ()=>{ try{ await onDelete(); } catch(e){} }} disabled={saving}>Delete</button>
        </div>
        {error ? <div className="text-xs text-red-500 mt-1">{error}</div> : null}
      </td>
    </tr>
  );
}

export default React.memo(VariantRowInner);
