"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormSection from '../../../ui/form/FormSection';
import FormInput from '../../../ui/form/FormInput';
import FormSelect from '@/src/components/ui/form/FormSelect';

export default function PricingSection() {
  return (
    <FormSection title="Pricing">
      <div className="grid grid-cols-3 gap-4">
        <FormInput name="basePrice" label="Price" type="number" />
        <FormInput name="comparePrice" label="Compare At" type="number" />
        <FormInput name="costPrice" label="Cost Price (internal)" type="number" />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-3">
        <FormInput name="discountValue" label="Discount value" type="number" />
        <FormSelect name="discountType" label="Discount Type" options={[{label:'Fixed', value:'fixed'},{label:'Percentage', value:'percentage'}]} />
        <FormInput name="saleStartDate" label="Sale start" type="date" />
        <FormInput name="saleEndDate" label="Sale end" type="date" />
      </div>
    </FormSection>
  );
}
