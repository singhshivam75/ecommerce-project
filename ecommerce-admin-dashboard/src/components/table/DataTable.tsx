// components/table/DataTable.tsx

export default function DataTable({
  columns,
  data,
  loading,
}: any) {
  return (
    <div className="
      bg-white/80 dark:bg-slate-900/80
      backdrop-blur-md
      border border-slate-200/60 dark:border-slate-800
      rounded-2xl shadow-sm overflow-hidden
    ">

      {/* HEADER */}
      <div className="
        grid grid-cols-12 px-6 py-3
        text-xs font-semibold text-slate-500
        border-b bg-slate-50 dark:bg-slate-800/50
      ">
        {columns.map((col: any) => (
          <div key={col.key} className={col.className}>
            {col.title}
          </div>
        ))}
      </div>

      {/* BODY */}
      {loading ? (
        <div className="text-center py-6 text-slate-500">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-6 text-slate-500">
          No data found
        </div>
      ) : (
        data.map((row: any) => (
          <div
            key={row.id}
            className="
              grid grid-cols-12 items-center
              px-6 py-4 border-b last:border-none
              hover:bg-slate-50 dark:hover:bg-slate-800/50
            "
          >
            {columns.map((col: any) => (
              <div key={col.key} className={col.className}>
                {col.render ? col.render(row) : row[col.key]}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}