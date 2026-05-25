export type AttributePair = { name: string; value: string };

export function objectToAttributes(obj: Record<string, string> | undefined): AttributePair[] {
  if (!obj) return [];
  return Object.keys(obj).map((k) => ({ name: k, value: obj[k] }));
}

export function attributesToObject(attrs: AttributePair[] | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!attrs) return out;
  for (const a of attrs) {
    if (!a?.name) continue;
    out[a.name] = a.value ?? "";
  }
  return out;
}

export function variantLabel(obj: Record<string, string> | undefined): string {
  if (!obj) return "";
  // preserve insertion order of keys as supplied
  return Object.values(obj).filter(Boolean).join(" • ");
}

export function normalizeAttributeObject(obj: Record<string, string> | undefined): string {
  if (!obj) return "";
  const keys = Object.keys(obj).sort();
  return JSON.stringify(keys.reduce((acc: Record<string, string>, k) => ({ ...acc, [k]: obj[k] }), {}));
}

export default { objectToAttributes, attributesToObject, variantLabel, normalizeAttributeObject };
