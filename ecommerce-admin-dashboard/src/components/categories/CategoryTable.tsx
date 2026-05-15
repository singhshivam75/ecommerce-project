import React from "react";
import DataTable from "@/src/components/table/DataTable";
import { Edit3, Trash2, PlusCircle } from "lucide-react";

export default function CategoryTable({ data, loading, onEdit, onAddChild, onDelete }: any) {
  const columns = [
    { key: "name", title: "Name", className: "col-span-3" },
    { key: "parent", title: "Parent", className: "col-span-2 text-slate-500", render: (r:any)=>(<div className="text-sm">{r.parent?.name ?? r.parentName ?? '-'}</div>) },
    { key: "slug", title: "Slug", className: "col-span-3 text-slate-500" },
    { key: "childrenCount", title: "Subcategories", className: "col-span-1 text-center text-slate-500", render: (r:any)=>(<div className="text-sm">{r.children?.length ?? 0}</div>) },
    { key: "status", title: "Status", className: "col-span-2 text-center", render: (r:any)=>(r.isActive ? <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs">Active</span> : <span className="inline-flex items-center px-2 py-1 rounded-full bg-rose-50 text-rose-600 text-xs">Inactive</span>) },
    { key: "actions", title: "Actions", className: "col-span-2 text-right", render: (r:any)=>(
      <div className="flex items-center gap-3 justify-end">
        <button title="Add subcategory" className="flex items-center gap-1 text-indigo-600" onClick={()=>onAddChild(r)}><PlusCircle className="w-4 h-4"/> <span className="hidden sm:inline">Add</span></button>
        <button title="Edit" className="flex items-center gap-1 text-slate-600" onClick={()=>onEdit(r)}><Edit3 className="w-4 h-4"/> <span className="hidden sm:inline">Edit</span></button>
        <button title="Delete" className="flex items-center gap-1 text-rose-600" onClick={()=>onDelete(r)}><Trash2 className="w-4 h-4"/> <span className="hidden sm:inline">Delete</span></button>
      </div>
    )},
  ];

  return <DataTable columns={columns} data={data} loading={loading} />;
}
