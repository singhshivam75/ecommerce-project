"use client";

import React, { useEffect, useState } from 'react';
import { ProductsAPI } from '../../../lib/products.api';
import toast from 'react-hot-toast';

type Spec = { id?: number; name: string; value: string; highlighted?: boolean; sortOrder?: number };
type SpecGroup = { id?: number; title: string; specs: Spec[] };

export default function SpecificationsManager({ productId }: { productId?: string }) {
  const [groups, setGroups] = useState<SpecGroup[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ (async ()=>{
    if (!productId) return;
    setLoading(true);
    try{
      const res = await ProductsAPI.getById(productId);
      const data = res?.data?.specifications || res?.data?.product?.specifications || [];
      // transform flat list into groups by groupTitle
      const map = new Map<string, SpecGroup>();
      (data||[]).forEach((s:any)=>{
        const title = s.group || 'General';
        if (!map.has(title)) map.set(title, { title, specs: [] });
        // backend uses { key, value }
        const name = s.key ?? s.name ?? '';
        map.get(title)!.specs.push({ id: s.id, name, value: s.value, highlighted: !!s.highlighted });
      });
      setGroups(Array.from(map.values()));
    }catch(err){ console.error(err); toast.error('Failed to load specs'); }
    setLoading(false);
  })(); }, [productId]);

  const addGroup = ()=> setGroups(prev=>[...prev,{ title:'New Group', specs:[] }]);
  const addSpec = (gIdx:number)=>{
    const copy=[...groups]; copy[gIdx].specs.push({ name:'', value:'', highlighted:false }); setGroups(copy);
  };

  const saveSpec = async (gIdx:number, sIdx:number) => {
    const spec = groups[gIdx].specs[sIdx];
    try{
      if (!productId) throw new Error('Missing productId');
      const payload = { productId, group: groups[gIdx].title, key: spec.name, value: spec.value, highlighted: !!spec.highlighted };
      const res = await ProductsAPI.addSpecification(payload);
      if (res?.data) { const copy=[...groups]; copy[gIdx].specs[sIdx].id = res.data.id; setGroups(copy); toast.success('Saved'); }
    }catch(err){ toast.error('Failed to save'); }
  };

  const removeSpec = async (gIdx:number, sIdx:number) => {
    const spec = groups[gIdx].specs[sIdx];
    const prev = [...groups];
    const copy = [...groups]; copy[gIdx].specs.splice(sIdx,1); setGroups(copy);
    if (spec.id) {
      try{ await ProductsAPI.deleteSpecification(spec.id); toast.success('Deleted'); } catch(e){ setGroups(prev); toast.error('Delete failed'); }
    }
  };

  const moveGroup = (from:number,to:number)=>{ if(to<0||to>=groups.length) return; const copy=[...groups]; const [g]=copy.splice(from,1); copy.splice(to,0,g); setGroups(copy); }

  if (loading) return <div className="p-4"><div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"/></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Specifications</h2>
        <div>
          <button className="px-3 py-1 border rounded mr-2" onClick={addGroup}>+ Add Group</button>
        </div>
      </div>

      <div className="space-y-4">
        {groups.map((g, gi)=> (
          <div key={gi} className="bg-white p-4 border rounded">
            <div className="flex items-center justify-between mb-2">
              <input value={g.title} onChange={(e)=>{ const copy=[...groups]; copy[gi].title=e.target.value; setGroups(copy); }} className="text-lg font-medium" />
              <div>
                <button className="px-2 py-1 border mr-2" onClick={()=>moveGroup(gi,gi-1)}>↑</button>
                <button className="px-2 py-1 border" onClick={()=>moveGroup(gi,gi+1)}>↓</button>
              </div>
            </div>

            <div className="space-y-2">
              {g.specs.map((s, si)=> (
                <div key={si} className="grid grid-cols-12 gap-2 items-center">
                  <input value={s.name} onChange={(e)=>{ const copy=[...groups]; copy[gi].specs[si].name=e.target.value; setGroups(copy); }} className="col-span-4 border rounded px-2 py-1" placeholder="Name" />
                  <input value={s.value} onChange={(e)=>{ const copy=[...groups]; copy[gi].specs[si].value=e.target.value; setGroups(copy); }} className="col-span-6 border rounded px-2 py-1" placeholder="Value" />
                  <div className="col-span-2 flex gap-2">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={!!s.highlighted} onChange={(e)=>{ const copy=[...groups]; copy[gi].specs[si].highlighted = e.target.checked; setGroups(copy); }} /> Highlight</label>
                    <button className="text-sm text-green-600" onClick={()=>saveSpec(gi,si)}>Save</button>
                    <button className="text-sm text-red-500" onClick={()=>removeSpec(gi,si)}>Delete</button>
                  </div>
                </div>
              ))}
              <div>
                <button className="px-3 py-1 border rounded" onClick={()=>addSpec(gi)}>+ Add Spec</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
