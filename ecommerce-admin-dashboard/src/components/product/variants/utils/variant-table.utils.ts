import { VariantCombination } from "../types";
import { normalizeAttributeObject } from "./attribute.utils";

export function mergeCombinationsWithExisting(existing: VariantCombination[], combos: Array<Record<string, string>>) {
  const seen = new Set<string>();
  for (const e of existing) {
    const key = normalizeAttributeObject(e.attributes ?? {});
    seen.add(key);
  }

  const unique: Array<Record<string, string>> = [];
  for (const c of combos) {
    const key = normalizeAttributeObject(c ?? {} as Record<string,string>);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(c);
    }
  }
  return unique;
}

export function generateAutoSKU(prefix: string | undefined, attributes: Record<string, string>) {
  const parts: string[] = [];
  if (prefix) parts.push(String(prefix).toUpperCase().replace(/\s+/g, ""));
  // stable order by key
  const keys = Object.keys(attributes).sort();
  for (const k of keys) {
    const v = attributes[k] ?? "";
    if (v === "") continue;
    parts.push(String(v).toUpperCase().replace(/\s+/g, ""));
  }
  return parts.join("-");
}

export default { mergeCombinationsWithExisting, generateAutoSKU };
