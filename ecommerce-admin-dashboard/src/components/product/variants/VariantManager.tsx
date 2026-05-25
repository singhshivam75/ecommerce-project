"use client";

import React, { useState } from "react";
import OptionBuilder from "./OptionBuilder";
import VariantGenerator from "./VariantGenerator";
import VariantTable from "./VariantTable";
import { VariantOptionGroup, VariantCombination } from "./types";
import useVariants from "./hooks/useVariants";

type Props = { productId?: string };

export default function VariantManager({ productId }: Props) {
  const [groups, setGroups] = useState<VariantOptionGroup[]>([]);
  const variantsHook = useVariants(productId);

  const handleGenerate = async (combinations: VariantCombination[]) => {
    await variantsHook.addVariantsBulk(combinations.map((c) => ({ ...c, productId })));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OptionBuilder groups={groups} onChange={setGroups} />
        <VariantGenerator groups={groups} existingVariants={variantsHook.variants} onGenerate={(c)=>handleGenerate(c)} />
      </div>
      <VariantTable
        productId={productId}
        variants={variantsHook.variants}
        loading={variantsHook.loading}
        setLocalVariant={variantsHook.setLocalVariant}
        saveVariant={variantsHook.saveVariant}
        deleteVariant={variantsHook.deleteVariant}
        refresh={variantsHook.refresh}
        dirtyRows={variantsHook.dirtyRows}
        savingRows={variantsHook.savingRows}
        saveAllDirty={variantsHook.saveAllDirty}
        cancelEdit={variantsHook.cancelEdit}
        isDirty={variantsHook.isDirty}
      />
    </div>
  );
}
