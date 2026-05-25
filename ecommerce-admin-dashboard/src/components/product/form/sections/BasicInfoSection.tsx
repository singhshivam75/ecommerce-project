"use client";

import React, { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import FormInput from '../../../ui/form/FormInput';
import FormTextarea from '../../../ui/form/FormTextarea';
import CategoryTreeSelect from '../../CategoryTreeSelect';
import FormSection from '../../../ui/form/FormSection';
import { ProductsAPI } from '../../../../lib/products.api';
import { generateSlug } from '../utils/slugify';
import toast from 'react-hot-toast';

export default function BasicInfoSection({ categories }: any) {
  const { watch, setValue, getValues, setError, clearErrors } = useFormContext();
  const catOptions = (categories || []).map((c: any) => ({ label: c.name, value: String(c.id) }));

  const title = watch('title');
  const slug = watch('slug');
  const manualSlugRef = useRef(false);

  useEffect(() => {
    if (!manualSlugRef.current) {
      const s = generateSlug(title || '');
      setValue('slug', s);
    }
  }, [title, setValue]);

  const handleSlugChange = (e: any) => {
    manualSlugRef.current = true;
    setValue('slug', e.target.value);
  };

  const checkSlugUnique = async () => {
    const s = getValues('slug');
    if (!s) return true;
    try {
      // Avoid sending `slug` as a query param (some backends reject unknown query fields).
      // Use the generic `search` param and filter client-side for exact slug match.
      const res = await ProductsAPI.getAll({ search: s });
      const items = res?.data?.data || res?.data || res || [];
      const matches = (Array.isArray(items) ? items : []).filter((it: any) => it.slug === s);
      // If editing an existing product, allow matching the same id
      const currentId = getValues('id') || getValues('productId') || null;
      const realMatches = matches.filter((m: any) => currentId ? String(m.id) !== String(currentId) : true);
      return realMatches.length === 0;
    } catch (e) {
      // network or server error - do not spam console, return undefined to signal failure
      console.debug('slug check failed', e);
      return undefined as unknown as boolean;
    }
  };

  const onSlugBlur = async () => {
    const ok = await checkSlugUnique();
    if (ok === undefined) {
      // validation could not be performed
      toast('Could not validate slug uniqueness — proceeding');
      clearErrors('slug');
      return;
    }

    if (ok === false) {
      setError('slug', { type: 'validate', message: 'Slug is already taken' });
    } else if (ok === true) {
      clearErrors('slug');
    }
  };

  return (
    <FormSection title="Basic Information">
      <div className="grid grid-cols-2 gap-4">
        <FormInput name="title" label="Title *" />
        <FormInput name="brand" label="Brand" />
        <FormInput name="slug" label="Slug" onChange={handleSlugChange} onBlur={onSlugBlur} />
        <CategoryTreeSelect categories={categories} />
        <FormInput name="basePrice" label="Base Price" type="number" />
      </div>

      <div className="mt-2 text-sm text-slate-500">Preview: <span className="font-medium">{slug}</span></div>

      <FormTextarea name="shortDescription" label="Short Description" />
      <FormTextarea name="description" label="Description" rows={6} />
    </FormSection>
  );
}
