"use client";

import React from 'react';
import FormSection from '../../../ui/form/FormSection';
import FormImageUpload from '../../../ui/form/FormImageUpload';

export default function MediaSection() {
  return (
    <FormSection title="Media">
      <FormImageUpload name="images" />
    </FormSection>
  );
}
