// components/table/TableSearch.tsx

export default function TableSearch({ value, onChange }: any) {
  return (
    <input
      placeholder="Search products, variants, SKU..."
      className={
        'w-full h-11 px-4 rounded-xl bg-white border border-slate-200 shadow-sm text-sm outline-none transition-all duration-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500'
      }
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}