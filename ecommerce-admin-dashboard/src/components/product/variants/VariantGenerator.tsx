"use client";

import React, { useMemo, useState } from "react";
import { VariantOptionGroup, VariantCombination } from "./types";
import { generateCombinations } from "./utils/variant-generator";
import { mergeCombinationsWithExisting, generateAutoSKU } from "./utils/variant-table.utils";
import { variantLabel } from "./utils/attribute.utils";

type Props = {
  groups: VariantOptionGroup[];
  existingVariants?: VariantCombination[];
  onGenerate: (combinations: VariantCombination[]) => void;
};

export default function VariantGenerator({ groups, existingVariants = [], onGenerate }: Props) {
  const [skuPrefix, setSkuPrefix] = useState("");
  const [bulkPrice, setBulkPrice] = useState<number | "">("");
  const [bulkStock, setBulkStock] = useState<number | "">("");

  const combos = useMemo(() => generateCombinations(groups.map((g) => ({ name: g.name, values: g.values }))), [groups]);

  const unique = useMemo(() => mergeCombinationsWithExisting(existingVariants, combos), [existingVariants, combos]);

  const preview = useMemo(() => {
    return combos.map((attrs) => ({
      attributes: attrs,
      sku: generateAutoSKU(skuPrefix, attrs),
      price: typeof bulkPrice === 'number' ? bulkPrice : undefined,
      stock: typeof bulkStock === 'number' ? bulkStock : 0,
    } as VariantCombination));
  }, [combos, skuPrefix, bulkPrice, bulkStock]);

  const handleGenerate = () => {
    // filter duplicates
    const toAdd = mergeCombinationsWithExisting(existingVariants, combos).map((attrs) => ({
      attributes: attrs,
      sku: generateAutoSKU(skuPrefix, attrs),
      price: typeof bulkPrice === 'number' ? bulkPrice : 0,
      stock: typeof bulkStock === 'number' ? bulkStock : 0,
    } as VariantCombination));

    if (!toAdd.length) {
      // nothing to add
      return;
    }

    onGenerate(toAdd);
  };

  return (
    <div className="p-4 bg-white border rounded flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Generate Variants</h4>
        <div className="flex items-center gap-2">
          <input placeholder="SKU prefix" className="input" value={skuPrefix} onChange={(e)=>setSkuPrefix(e.target.value)} />
          <button className="btn" onClick={handleGenerate} disabled={!groups.length}>Generate</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label className="text-sm">Bulk price</label>
          <input className="input" value={bulkPrice as any} onChange={(e)=>setBulkPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Leave blank to skip" />
        </div>
        <div>
          <label className="text-sm">Bulk stock</label>
          <input className="input" value={bulkStock as any} onChange={(e)=>setBulkStock(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Leave blank to skip" />
        </div>
        <div>
          <label className="text-sm">Preview</label>
          <div className="text-sm text-gray-600">{combos.length} combinations · {unique.length} new</div>
        </div>
      </div>

      <div className="max-h-44 overflow-auto border rounded p-2 bg-gray-50">
        {preview.length === 0 ? (
          <div className="text-sm text-gray-500">No combinations to preview</div>
        ) : (
          <ul className="space-y-2">
            {preview.slice(0, 200).map((p, i) => (
              <li key={i} className={`p-2 rounded hover:bg-white flex justify-between items-center ${mergeCombinationsWithExisting(existingVariants, [p.attributes]).length === 0 ? 'opacity-50' : ''}`}>
                <div>
                  <div className="font-medium">{p.sku}</div>
                  <div className="text-sm text-gray-600">{variantLabel(p.attributes)}</div>
                </div>
                <div className="text-sm text-gray-500">Price: {p.price ?? '-'} · Stock: {p.stock}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
