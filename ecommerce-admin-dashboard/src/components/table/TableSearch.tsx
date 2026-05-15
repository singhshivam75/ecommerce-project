// components/table/TableSearch.tsx

export default function TableSearch({ value, onChange }: any) {
  return (
    <input
      placeholder="Search..."
      className="
        w-full px-4 py-2 rounded-xl
        bg-slate-100 dark:bg-slate-800
        outline-none text-sm
      "
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}