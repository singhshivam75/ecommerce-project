export type AttrPair = { name: string; value: string };

// Convert attributes object to array of pairs for UI
export function objectToAttributes(obj: Record<string, string> | undefined): AttrPair[] {
  if (!obj) return [];
  return Object.keys(obj).map((k) => ({ name: k, value: obj[k] }));
}

// Convert array of pairs to attributes object expected by backend
export function attributesToObject(pairs: AttrPair[] | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!pairs) return out;
  pairs.forEach((p) => {
    if (p.name) out[p.name] = p.value ?? '';
  });
  return out;
}

export function attributesToDisplay(obj: Record<string, string> | undefined) {
  if (!obj) return '';
  return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(' • ');
}

export default {
  objectToAttributes,
  attributesToObject,
  attributesToDisplay,
};
