export function sanitizePayload(
  obj: any
): any {
  if (obj == null) return obj;

  if (Array.isArray(obj)) {
    const arr = obj
      .map((v) => sanitizePayload(v))
      .filter(
        (v) =>
          v !== undefined &&
          v !== null &&
          !(
            typeof v === "string" &&
            v.trim() === ""
          )
      );

    return arr.length
      ? arr
      : undefined;
  }

  if (typeof obj === "object") {
    const out: Record<string, any> = {};

    for (const key of Object.keys(obj)) {
      const val = obj[key];

      if (
        val === undefined ||
        val === null
      ) {
        continue;
      }

      if (typeof val === "string") {
        if (val.trim() === "") {
          continue;
        }

        out[key] = val;
        continue;
      }

      if (typeof val === "number") {
        if (
          !Number.isFinite(val) ||
          Number.isNaN(val)
        ) {
          continue;
        }

        out[key] = val;
        continue;
      }

      if (val instanceof Date) {
        out[key] = val.toISOString();
        continue;
      }

      const cleaned =
        sanitizePayload(val);

      if (cleaned === undefined) {
        continue;
      }

      out[key] = cleaned;
    }

    return Object.keys(out).length
      ? out
      : undefined;
  }

  return obj;
}