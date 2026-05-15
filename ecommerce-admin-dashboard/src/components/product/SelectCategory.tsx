import React from "react";
import { CategoriesAPI } from "../../lib/categories.api";

function SelectCategory({ form, setForm, categories }:any){

  const cats = Array.isArray(categories)
    ? categories
    : categories && Array.isArray(categories.data)
    ? categories.data
    : [];

  const getParentId = (c:any) => {
    if (c?.parentId !== undefined) {
      if (c.parentId === null) return null;
      return String(c.parentId);
    }
    if (!c.parent && c.parent !== 0) return null;
    if (typeof c.parent === "object") return String(c.parent?.id ?? null);
    if (typeof c.parent === "number") return String(c.parent);
    if (typeof c.parent === "string") return c.parent;
    return null;
  };

  const parent = cats.filter((c:any) => getParentId(c) === null);

  const selectedId = form.categoryId ? String(form.categoryId) : null;
  const sub = cats.filter((c:any) => getParentId(c) === selectedId);

  const [remoteSub, setRemoteSub] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!selectedId) {
      setRemoteSub([]);
      return;
    }

    // if we have local subcategories, no need to fetch
    if (sub.length > 0) {
      setRemoteSub([]);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const res = await CategoriesAPI.getSubCategoriesByCategory(selectedId as any);
        const data = res.data?.data ?? res.data ?? [];
        if (mounted) setRemoteSub(Array.isArray(data) ? data.map((d:any)=>({ ...d, id: String(d.id) })) : []);
      } catch {
        if (mounted) setRemoteSub([]);
      }
    })();

    return () => { mounted = false; };
  }, [selectedId, sub]);

  return (
    <>
      <div>
        <label className="text-sm font-medium">Category *</label>
        <select
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          value={form.categoryId ?? ""}
          onChange={(e)=>setForm({
            ...form,
            categoryId: e.target.value,
            subCategoryId: ""
          })}
        >
          <option value="">Select category</option>
          {parent.map((c:any)=>(
            <option key={c.id} value={String(c.id)}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Sub Category</label>
        <select
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          value={form.subCategoryId ?? ""}
          onChange={(e)=>setForm({...form,subCategoryId:e.target.value})}
        >
          <option value="">Select sub category</option>
          {(sub.length > 0 ? sub : remoteSub).map((c:any)=>(
            <option key={c.id} value={String(c.id)}>{c.name}</option>
          ))}
        </select>
      </div>
    </>
  );
}

export default SelectCategory;