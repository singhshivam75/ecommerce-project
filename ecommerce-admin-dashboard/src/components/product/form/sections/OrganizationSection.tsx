import React from 'react';
import FormSection from '../../../ui/form/FormSection';
import FormSelect from '../../../ui/form/FormSelect';

export default function OrganizationSection({ categories }: any) {
  const options = (categories || []).map((c: any) => ({ label: c.name, value: c.id }));
  return (
    <FormSection title="Organization">
      <FormSelect name="categoryId" label="Category" options={options} />
    </FormSection>
  );
}
