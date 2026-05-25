"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormField from './FormField';

type Props = Readonly<React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  help?: string;
}>;

export default function FormInput({ name, label, help, ...rest }: Props) {
  const methods = useFormContext();
  const regProps = methods && name ? methods.register(name) : undefined;
  const error = methods?.formState?.errors?.[name as any]?.message as string | undefined;

  return (
    <FormField label={label} help={help} error={error}>
      <input
        {...(regProps ?? {})}
        {...rest}
        className="w-full h-11 rounded-xl border border-slate-200 bg-white shadow-sm px-4 text-sm outline-none transition-all duration-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
      />
    </FormField>
  );
}
