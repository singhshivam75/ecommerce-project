"use client";

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

type ImageItem = { url: string; alt?: string; isPrimary?: boolean };

export default function FormImageUpload({ name }: { name: string }) {
  const methods = useFormContext();
  const control = methods?.control;

  if (!control) {
    // simple fallback UI when form control is not present
    return (
      <div>
        <div className="gap-3">
          <div className="p-2 border rounded flex items-center gap-2">
            <input className="flex-1 border rounded px-2 py-1" placeholder="Image URL" />
            <input type="radio" />
            <button className="text-red-500" type="button">
              Delete
            </button>
          </div>
        </div>
        <div className="mt-2">
          <button type="button" className="px-3 py-1 border rounded">
            + Add Image
          </button>
        </div>
      </div>
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[{ url: '', isPrimary: true }]}
      render={({ field }) => (
        <div>
          <div className="gap-3">
            {(field.value || []).map((img: ImageItem, i: number) => (
              <div key={i} className="rounded flex items-center gap-2">
                <input
                  className="flex-1 border rounded px-2 py-1"
                  placeholder="Image URL"
                  value={img.url}
                  onChange={(e) => {
                    const copy = [...field.value];
                    copy[i] = { ...copy[i], url: e.target.value };
                    field.onChange(copy);
                  }}
                />
                <input
                  type="radio"
                  checked={img.isPrimary}
                  onChange={() => {
                    field.onChange(
                      (field.value || []).map((x: ImageItem, idx:number)=>({ ...x, isPrimary: idx===i }))
                    );
                  }}
                />
                <button
                  className="text-red-500"
                  onClick={() => field.onChange(field.value.filter((_:any, idx:number)=>idx!==i))}
                  type="button"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <button
              type="button"
              className="px-3 py-1 border rounded"
              onClick={() => field.onChange([...(field.value || []), { url: '', isPrimary: false }])}
            >
              + Add Image
            </button>
          </div>
        </div>
      )}
    />
  );
}
