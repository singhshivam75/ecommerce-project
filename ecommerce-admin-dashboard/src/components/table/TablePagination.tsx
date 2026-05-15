export default function TablePagination({
  page,
  totalPages,
  onChange,
}: any) {
  const safeTotal = totalPages || 1;

  return (
    <div className="flex justify-between items-center px-2">

      <span className="text-sm text-slate-500">
        Page {page} of {safeTotal}
      </span>

      <div className="flex gap-2">

        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="px-3 py-1 rounded-lg bg-slate-100 disabled:opacity-50"
        >
          Prev
        </button>

        <button
          disabled={page >= safeTotal}
          onClick={() => onChange(page + 1)}
          className="px-3 py-1 rounded-lg bg-slate-100 disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}

