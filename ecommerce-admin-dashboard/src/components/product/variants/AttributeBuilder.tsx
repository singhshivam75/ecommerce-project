import React from 'react';
import FormField from '../../ui/form/FormField';
import { objectToAttributes, attributesToObject, AttrPair } from '../../../utils/attributes';

type Props = {
  attributes: Record<string, string> | undefined;
  onChange: (attrs: Record<string, string>) => void;
};

export default function AttributeBuilder({ attributes, onChange }: Props) {
  const pairs: AttrPair[] = objectToAttributes(attributes);
  const append = () => {
    const next = [...pairs, { name: '', value: '' }];
    onChange(attributesToObject(next));
  };
  const remove = (i: number) => {
    const next = pairs.filter((_, idx) => idx !== i);
    onChange(attributesToObject(next));
  };

  const update = (i: number, patch: Partial<AttrPair>) => {
    const copy = pairs.map((a, idx) => (idx === i ? { ...a, ...patch } : a));
    onChange(attributesToObject(copy));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Attributes</h4>
        <button type="button" className="text-sm text-indigo-600" onClick={append}>
          + Add
        </button>
      </div>

      <div className="space-y-2">
        {pairs.map((f, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 items-center">
            <FormField>
              <input className="border rounded px-2 py-1 text-sm" value={f.name} onChange={(e) => update(i, { name: e.target.value })} />
            </FormField>
            <FormField>
              <input className="border rounded px-2 py-1 text-sm" value={f.value} onChange={(e) => update(i, { value: e.target.value })} />
            </FormField>
            <div>
              <button type="button" className="text-red-500" onClick={() => remove(i)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
