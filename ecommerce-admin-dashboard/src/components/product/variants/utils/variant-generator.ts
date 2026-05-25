export type OptionGroup = { name: string; values: string[] };

// Generate cartesian product of option groups
export function generateCombinations(groups: OptionGroup[]): Array<Record<string, string>> {
  if (!groups || groups.length === 0) return [];

  const result: Array<Record<string, string>> = [];

  function recurse(index: number, acc: Record<string, string>) {
    if (index === groups.length) {
      result.push({ ...acc });
      return;
    }
    const group = groups[index];
    const vals = group.values && group.values.length ? group.values : [""];
    for (const v of vals) {
      acc[group.name] = v;
      recurse(index + 1, acc);
    }
  }

  recurse(0, {} as Record<string, string>);

  return result;
}

export default generateCombinations;
