"use client";

import React from 'react';
import FormSection from '../../../ui/form/FormSection';
import FormTagInput from '../../../ui/form/FormTagInput';

export default function TagsSection() {
  return (
    <FormSection title="Tags">
      <FormTagInput name="tags" />
    </FormSection>
  );
}
