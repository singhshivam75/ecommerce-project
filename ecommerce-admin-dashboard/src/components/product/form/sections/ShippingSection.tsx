"use client";

import React from 'react';
import FormSection from '../../../ui/form/FormSection';
import FormInput from '../../../ui/form/FormInput';

export default function ShippingSection() {
  return (
    <FormSection title="Shipping">
      <div className="grid grid-cols-2 gap-4">
        <FormInput name="weight" label="Weight" type="number" step="0.01" />
        <FormInput name="length" label="Length" type="number" />
        <FormInput name="width" label="Width" type="number" />
        <FormInput name="height" label="Height" type="number" />
        <FormInput name="shippingClass" label="Shipping Class" />
        <FormInput name="countryOfOrigin" label="Country of Origin" />
      </div>
    </FormSection>
  );
}
