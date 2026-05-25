"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormField from './FormField';

type Props = Readonly<React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  label?: string;
  help?: string;
}>;

export default function FormTextarea({ name, label, help, ...rest }: Props) {
  const methods = useFormContext();
  const regProps = methods && name ? methods.register(name) : undefined;
  const error = methods?.formState?.errors?.[name as any]?.message as string | undefined;

  return (
    <FormField label={label} help={help} error={error}>
      <textarea
        {...(regProps ?? {})}
        {...rest}
        className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-4 text-sm h-36 resize-vertical outline-none transition-all duration-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
      />
    </FormField>
  );
}
