"use client";

import React from 'react';
import FormSection from '../../../ui/form/FormSection';
import FormSwitch from '../../../ui/form/FormSwitch';
import FormSelect from '../../../ui/form/FormSelect';
import FormInput from '../../../ui/form/FormInput';
import { useFormContext } from 'react-hook-form';

export default function StatusSection() {
  const { register } = useFormContext();
  return (
    <FormSection title="Status">
      <div className="flex items-center gap-6">
        <FormSwitch name="featured" label="Featured" />
        <FormSwitch name="isNewArrival" label="New Arrival" />
        <FormSwitch name="isActive" label="Active" />
      </div>

      <div className="mt-3">
        <FormSelect name="status" label="Publication status" options={[{label:'Draft',value:'draft'},{label:'Published',value:'published'},{label:'Archived',value:'archived'},{label:'Out Of Stock',value:'out_of_stock'}]} />
      </div>
    </FormSection>
  );
}
