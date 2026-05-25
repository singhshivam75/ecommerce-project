"use client";

import React from 'react';
import FormSection from '../../../ui/form/FormSection';
import FormInput from '../../../ui/form/FormInput';

export default function InventorySection() {
  return (
    <FormSection title="Inventory">
      <div className="grid grid-cols-2 gap-4">
        <FormInput name="sku" label="SKU" />
        <FormInput name="barcode" label="Barcode" />
        <FormInput name="stock" label="Stock" type="number" />
        <FormInput name="lowStockThreshold" label="Low Stock Threshold" type="number" />
      </div>
    </FormSection>
  );
}
