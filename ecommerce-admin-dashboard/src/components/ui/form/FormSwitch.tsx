"use client";

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

type Props = {
  name: string;
  label?: string;
};

export default function FormSwitch({ name, label }: Props) {
  const methods = useFormContext();
  const control = methods?.control;

  if (!control) {
    return (
      <div>
        <label className="flex items-center gap-3">
          <span className="text-sm">{label}</span>
          <input type="checkbox" className="h-5 w-9 rounded-full bg-gray-200" />
        </label>
      </div>
    );
  }

  return (
    <div>
      <label className="flex items-center gap-3">
        <span className="text-sm">{label}</span>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="h-5 w-9 rounded-full bg-gray-200"
            />
          )}
        />
      </label>
    </div>
  );
}
