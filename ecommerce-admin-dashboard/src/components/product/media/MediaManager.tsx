"use client";

import React, { useEffect, useState } from 'react';
import { ProductsAPI } from '../../../lib/products.api';
import toast from 'react-hot-toast';
import { Variant } from '../../../types/variant';

type ImageItem = { id?: number; url: string; alt?: string; isPrimary?: boolean; uploading?: boolean };

export default function MediaManager({ productId }: { productId?: string }) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ (async ()=>{
    if (!productId) return;
    setLoading(true);
    try{
      const res = await ProductsAPI.getById(productId);
      const imgs = res?.data?.images || res?.data?.product?.images || [];
      setImages(imgs.map((i:any)=>({ id:i.id, url:i.url, alt:i.alt, isPrimary: !!i.isPrimary })));
    }catch(err){ console.error(err); toast.error('Failed to load images'); }
    setLoading(false);
  })(); }, [productId]);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const newImgs: ImageItem[] = Array.from(files).map(f => ({ url: URL.createObjectURL(f), alt: f.name, uploading: false }));
    setImages(prev => [...newImgs, ...prev]);
  };

  const setPrimary = async (idx: number) => {
    const prev = images;
    const next = images.map((im,i)=>({ ...im, isPrimary: i===idx }));
    setImages(next);

    // optimistic: if image has id, call API
    try{
      const img = next[idx];
      if (img.id) {
        await ProductsAPI.update(img.id, { isPrimary: true } as any);
      }
      toast.success('Primary set');
    }catch(err){ setImages(prev); toast.error('Failed to set primary'); }
  };

  const remove = async (idx: number) => {
    const prev = images;
    const item = images[idx];
    setImages(images.filter((_,i)=>i!==idx));
    if (item.id) {
      try{ await ProductsAPI.deleteImage(item.id); toast.success('Deleted'); } catch(e){ setImages(prev); toast.error('Delete failed'); }
    }
  };

  const uploadToServer = async (idx: number) => {
    const item = images[idx];
    if (!item) return;
    const prev = [...images];
    const next = [...images];
    next[idx] = { ...item, uploading: true };
    setImages(next);

    try{
      if (!productId) throw new Error('Missing productId');
      const res = await ProductsAPI.addImage({ productId, url: item.url, isPrimary: !!item.isPrimary });
      if (res?.data) {
        next[idx] = { ...next[idx], id: res.data.id, uploading: false };
        setImages(next);
        toast.success('Uploaded');
      }
    }catch(err){ setImages(prev); toast.error('Upload failed'); }
  };

  const move = (from:number, to:number) => {
    if (to<0 || to>=images.length) return;
    const copy = [...images];
    const [item] = copy.splice(from,1);
    copy.splice(to,0,item);
    setImages(copy);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Media Manager</h2>
        <div className="flex items-center gap-2">
          <label className="px-3 py-2 border rounded cursor-pointer">
            Upload
            <input type="file" multiple className="hidden" onChange={(e)=>onFiles(e.target.files)} />
          </label>
          <button className="px-3 py-2 border rounded" onClick={()=>{ setImages([]); }}>Clear</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({length:8}).map((_,i)=>(<div key={i} className="h-40 bg-gray-200 animate-pulse rounded"/>))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx)=>(
            <div key={img.id || img.url} className="border rounded overflow-hidden relative bg-white">
              <img src={img.url} alt={img.alt} className="h-40 w-full object-cover" />
              <div className="p-2">
                <input value={img.alt||''} onChange={(e)=>{
                  const copy=[...images]; copy[idx]={...copy[idx], alt:e.target.value}; setImages(copy);
                }} className="w-full border rounded px-2 py-1 text-sm" />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button className={`px-2 py-1 text-sm rounded ${img.isPrimary ? 'bg-indigo-600 text-white' : 'border'}`} onClick={()=>setPrimary(idx)}>Primary</button>
                    <button className="px-2 py-1 border text-sm" onClick={()=>move(idx, idx-1)}>↑</button>
                    <button className="px-2 py-1 border text-sm" onClick={()=>move(idx, idx+1)}>↓</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 border text-sm" onClick={()=>uploadToServer(idx)} disabled={!!img.id}>{img.uploading ? 'Uploading...' : (img.id ? 'Uploaded' : 'Upload')}</button>
                    <button className="px-2 py-1 text-red-500 text-sm" onClick={()=>remove(idx)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
