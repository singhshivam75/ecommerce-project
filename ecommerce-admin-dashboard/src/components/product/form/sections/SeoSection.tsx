"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormSection from '../../../ui/form/FormSection';
import FormInput from '../../../ui/form/FormInput';
import FormTextarea from '../../../ui/form/FormTextarea';

export default function SeoSection() {
  return (
    <FormSection title="SEO">
      <FormInput name="seoTitle" label="SEO Title" />
      <FormTextarea name="seoDescription" label="SEO Description" />
      <FormInput name="metaKeywords" label="Meta Keywords" />
      <FormInput name="searchKeywords" label="Search Keywords" />
    </FormSection>
  );
}
