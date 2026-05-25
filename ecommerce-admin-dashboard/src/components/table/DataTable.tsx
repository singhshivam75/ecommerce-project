// components/table/DataTable.tsx

import EmptyState from "@/src/components/ui/EmptyState";

export default function DataTable({ columns, data, loading, selectable, selectedIds, onToggleSelect, onToggleSelectAll, emptyMessage }: any) {

  let body: any;

  if (loading) {
    const skeletonKeys = ['s1', 's2', 's3', 's4', 's5', 's6'];
    body = (
      <div className="p-4">
        {skeletonKeys.map((k) => (
          <div key={k} className="animate-pulse flex items-center gap-4 py-4 border-b last:border-none">
            {selectable && <div className="h-5 w-5 bg-slate-100 rounded" />}
            <div className="h-5 bg-slate-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  } else if (!data || data.length === 0) {
    body = (
      <EmptyState
        title={emptyMessage?.title ?? 'No items found'}
        description={emptyMessage?.description ?? 'Try adjusting your filters or create a new item.'}
        icon={<div className="text-3xl">🗃️</div>}
        actionLabel={emptyMessage?.actionLabel}
        onAction={emptyMessage?.onAction}
      />
    );
  } else {
    body = data.map((row: any) => (
      <div
        key={row.id}
className="
  grid grid-cols-12
  items-center
  gap-4
  min-h-[92px]
  px-6 py-4 mb-3
  rounded-2xl
  border border-slate-200
  bg-white
  shadow-sm
  hover:shadow-lg
  hover:border-indigo-200
  hover:-translate-y-[1px]
  transition-all duration-200
"
      >
        {selectable && (
          <div className="col-span-1 flex items-center">
            <input type="checkbox" checked={selectedIds?.includes(row.id)} onChange={() => onToggleSelect?.(row.id)} />
          </div>
        )}

        {columns.map((col: any) => (
          <div key={col.key} className={col.className}>
            {col.render ? col.render(row) : row[col.key]}
          </div>
        ))}
      </div>
    ));
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="
  sticky top-0 z-10
  grid grid-cols-12
  px-6 py-4
  bg-slate-50/90
  backdrop-blur-xl
  border-b border-slate-200
">
        {selectable && (
          <div className="col-span-1 flex items-center">
            <input type="checkbox" checked={selectedIds?.length === data?.length && data?.length > 0} onChange={(e) => onToggleSelectAll?.(e.target.checked)} />
          </div>
        )}

        {columns.map((col: any) => (
          <div key={col.key} className={col.className}>
            <div className="uppercase tracking-widest text-[11px] font-bold text-slate-400">
              {col.title}
            </div>
          </div>
        ))}
      </div>

      {/* BODY */}
      <div className="p-2 bg-slate-50">
        {body}
      </div>
    </div>
  );
}