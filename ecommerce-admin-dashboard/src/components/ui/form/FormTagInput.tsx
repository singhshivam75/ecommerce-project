"use client";

import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

type Props = { name: string; label?: string };

export default function FormTagInput({ name }: Props) {
  const methods = useFormContext();
  const control = methods?.control;
  const [value, setValue] = useState('');

  if (!control) {
    const [local, setLocal] = useState<string[]>([]);
    return (
      <div>
        <div className="flex gap-2 flex-wrap mb-2">
          {local.map((t, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-2 py-1 text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value.trim()) {
                setLocal((s) => [...s, value.trim()]);
                setValue('');
                e.preventDefault();
              }
            }}
            placeholder="Add tag and press Enter"
          />
          <button
            type="button"
            className="px-3 py-1 bg-indigo-600 text-white rounded"
            onClick={() => {
              if (value.trim()) {
                setLocal((s) => [...s, value.trim()]);
                setValue('');
              }
            }}
          >
            Add
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <div>
            <div className="flex gap-2 flex-wrap mb-2">
              {(field.value || []).map((t: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {t}
                  <button
                    className="ml-2 text-xs"
                    onClick={() => field.onChange(field.value.filter((_:any, idx:number)=>idx!==i))}
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded px-2 py-1 text-sm"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && value.trim()) {
                    field.onChange([...(field.value || []), value.trim()]);
                    setValue('');
                    e.preventDefault();
                  }
                }}
                placeholder="Add tag and press Enter"
              />
              <button
                type="button"
                className="px-3 py-1 bg-indigo-600 text-white rounded"
                onClick={() => {
                  if (value.trim()) {
                    field.onChange([...(field.value || []), value.trim()]);
                    setValue('');
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
}
