// Split a list into fixed-size groups, e.g. for paging a section into rows.
//
// Lives here rather than alongside SectionPager because that file is a
// "use client" module: server components may render its exports as components
// or pass them as props, but may not *call* an exported function from one.
export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return items.length ? [items] : [];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
