"use client";

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import FormField from './FormField';

type Option = { label: string; value: string | number };

type Props = Readonly<{
  name: string;
  label?: string;
  options: Option[];
}>;

export default function FormSelect({ name, label, options }: Props) {
  const methods = useFormContext();
  const control = methods?.control;
  const regProps = methods && name ? methods.register(name) : undefined;
  const error = methods?.formState?.errors?.[name as any]?.message as string | undefined;

  return (
    <FormField label={label} error={error}>
      {control ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <select {...field} className="w-full h-11 rounded-xl border border-slate-200 bg-white shadow-sm px-3 text-sm outline-none transition-all duration-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500">
              <option value="">Select</option>
              {options.map((o) => (
                <option key={String(o.value)} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
        />
      ) : (
      <select {...(regProps ?? {})} className="w-full h-11 rounded-xl border border-slate-200 bg-white shadow-sm px-3 text-sm outline-none transition-all duration-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500">
          <option value="">Select</option>
          {options.map((o) => (
            <option key={String(o.value)} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FormField>
  );
}
