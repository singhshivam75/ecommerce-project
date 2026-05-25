"use client";

import React, { useState, useEffect } from 'react';
import { ProductsAPI } from '../../lib/products.api';

type Props = { onChange: (items: any[])=>void; selected?: any[] };

export default function RelatedProductSelector({ onChange, selected = [] }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (q: string)=>{
    if (!q) { setResults([]); return; }
    setLoading(true);
    try{ const res = await ProductsAPI.getAll({ search: q, limit: 10 }); setResults(res.data?.data || res.data || []); }catch(e){ console.error(e); }
    setLoading(false);
  };

  // debounce search with timeout
  useEffect(()=>{
    const t = setTimeout(()=>{ search(query); }, 300);
    return ()=>clearTimeout(t);
  }, [query]);

  const toggle = (item:any)=>{
    const exists = selected.find((s:any)=>s.id===item.id);
    const next = exists ? selected.filter((s:any)=>s.id!==item.id) : [...selected, item];
    onChange(next);
  };

  return (
    <div>
      <input className="w-full border rounded px-2 py-1" placeholder="Search products..." value={query} onChange={(e)=>setQuery(e.target.value)} />

      <div className="mt-2 bg-white border rounded max-h-56 overflow-auto">
        {loading ? <div className="p-2">Searching...</div> : results.map(r=> (
          <div key={r.id} className="p-2 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-2">
              <img src={r.images?.[0]?.url} className="w-8 h-8 object-cover rounded" />
              <div>
                <div className="text-sm">{r.title}</div>
                <div className="text-xs text-gray-400">₹{r.basePrice}</div>
              </div>
            </div>
            <button className="px-2 py-1 border rounded" onClick={()=>toggle(r)}>{selected.find((s:any)=>s.id===r.id) ? 'Remove' : 'Add'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
