"use client";

import React, { useCallback, useEffect, useState } from "react";
import { VariantOptionGroup } from "./types";

type Props = {
  groups: VariantOptionGroup[];
  onChange: (groups: VariantOptionGroup[]) => void;
};

function OptionBuilderInner({ groups, onChange }: Props) {
  const [local, setLocal] = useState<VariantOptionGroup[]>(groups || []);

  useEffect(() => {
    setLocal(groups || []);
  }, [groups]);

  const sync = useCallback((next: VariantOptionGroup[]) => {
    setLocal(next);
    onChange(next);
  }, [onChange]);

  const addGroup = useCallback(() => {
    const g: VariantOptionGroup = { id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, name: "Option", values: ["Value 1"] };
    sync([...local, g]);
  }, [local, sync]);

  const removeGroup = useCallback((id: string) => {
    sync(local.filter((g) => g.id !== id));
  }, [local, sync]);

  const updateGroup = useCallback((id: string, patch: Partial<VariantOptionGroup>) => {
    sync(local.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }, [local, sync]);

  const addValue = useCallback((id: string) => {
    updateGroup(id, { values: [...(local.find((g) => g.id === id)?.values || []), ""] });
  }, [local, updateGroup]);

  const removeValue = useCallback((id: string, idx: number) => {
    const g = local.find((x) => x.id === id);
    if (!g) return;
    const values = g.values.filter((_, i) => i !== idx);
    updateGroup(id, { values });
  }, [local, updateGroup]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Options</h3>
        <button className="btn" onClick={addGroup} aria-label="Add option group">Add Option Group</button>
      </div>
      <div className="space-y-3">
        {local.map((g) => (
          <div key={g.id} className="p-3 border rounded bg-white">
            <div className="flex gap-2 items-center">
              <input aria-label="Option name" className="input" value={g.name} onChange={(e) => updateGroup(g.id, { name: e.target.value })} onKeyDown={(e)=>{ if(e.key === 'Enter'){ addValue(g.id); } }} />
              <button className="text-red-500" onClick={() => removeGroup(g.id)} aria-label={`Remove ${g.name}`}>Remove</button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {g.values.map((v, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input aria-label={`Value ${idx+1}`} className="input" value={v} onChange={(e) => {
                    const vals = [...g.values]; vals[idx] = e.target.value; updateGroup(g.id, { values: vals });
                  }} onKeyDown={(e)=>{ if(e.key === 'Enter'){ const vals = [...g.values]; vals.splice(idx+1,0,''); updateGroup(g.id, { values: vals }); } }} />
                  <button className="text-sm text-red-500" onClick={() => removeValue(g.id, idx)} aria-label={`Remove value ${v}`}>x</button>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <button className="btn-sm" onClick={() => addValue(g.id)} aria-label={`Add value to ${g.name}`}>Add Value</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(OptionBuilderInner);
