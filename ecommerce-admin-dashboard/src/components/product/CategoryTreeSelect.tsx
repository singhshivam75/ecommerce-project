"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import FormField from "../ui/form/FormField";
import { Folder } from "lucide-react";

type Category = {
  id: string;
  name: string;
  parentId?: string | null;
  children?: Category[];
};

function buildTree(list: Category[]) {
  const map = new Map<string, Category & { children: Category[] }>();
  list.forEach((i) => map.set(i.id, { ...i, children: [] }));
  const roots: (Category & { children: Category[] })[] = [];
  map.forEach((node) => {
    const pid = (node as any).parentId ?? null;
    if (pid === null || pid === undefined || pid === "" || !map.has(String(pid))) {
      roots.push(node);
    } else {
      const parent = map.get(String(pid));
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
  });
  return roots;
}

function flattenWithDepth(nodes: Category[], depth = 0, out: { node: Category; depth: number }[] = []) {
  nodes.forEach((n) => {
    out.push({ node: n, depth });
    if (n.children && n.children.length) flattenWithDepth(n.children, depth + 1, out);
  });
  return out;
}

export default function CategoryTreeSelect({ name = "categoryId", subName = "subCategoryId", categories = [] }: any) {
  const { control, setValue, watch } = useFormContext();
  const catList: Category[] = useMemo(() => {
    if (!categories) return [];
    // If nodes already nested (have children) use directly
    if (Array.isArray(categories) && categories.length && (categories[0] as any).children) return categories;
    return Array.isArray(categories) ? categories.map((c: any) => ({ ...c, id: String(c.id), name: c.name || c.title || `Category ${c.id}`, parentId: c.parentId ?? c.parent?.id ?? null })) : [];
  }, [categories]);

  // If backend already returns nested `children`, use it directly. Otherwise build tree from flat list.
  const tree = useMemo(() => {
    if (Array.isArray(catList) && catList.length && (catList[0] as any).children) return catList;
    return buildTree(catList);
  }, [catList]);
  const flat = useMemo(() => flattenWithDepth(tree), [tree]);

  const selectedCategoryId = watch(name);
  const selectedSubId = watch(subName);

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    // expand path to selected node
    const target = selectedSubId || selectedCategoryId;
    if (!target) return;
    // find ancestry by walking flat
    const map = new Map<string, any>();
    flat.forEach((f) => map.set(f.node.id, f));
    const ex: Record<string, boolean> = {};
    let cur = map.get(String(target))?.node;
    while (cur) {
      ex[cur.id] = true;
      if (!cur.parentId) break;
      cur = map.get(String(cur.parentId))?.node;
    }
    setExpanded(ex);
  }, [selectedCategoryId, selectedSubId, flat]);

  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  // When searching, create a pruned tree containing only matching nodes and their ancestors
  const filterTree = (nodes: Category[], q: string): Category[] => {
    if (!q) return nodes;
    const lower = q.toLowerCase();
    const walk = (arr: Category[]): Category[] => {
      const out: Category[] = [];
      for (const n of arr) {
        const matched = (n.name || '').toLowerCase().includes(lower);
        const children = n.children ? walk(n.children) : [];
        if (matched || children.length) {
          out.push({ ...n, children });
        }
      }
      return out;
    };
    return walk(nodes);
  };

  const pruned = useMemo(() => filterTree(tree, query), [tree, query]);

  const onSelect = (node: Category) => {
    if (!node) return;
    if (!node.parentId) {
      // root selected
      setValue(name, String(node.id), { shouldValidate: true, shouldDirty: true });
      setValue(subName, "", { shouldValidate: true, shouldDirty: true });
    } else {
      setValue(name, String(node.parentId), { shouldValidate: true, shouldDirty: true });
      setValue(subName, String(node.id), { shouldValidate: true, shouldDirty: true });
    }
    setOpen(false);
  };

  const renderNode = (node: Category, depth = 0) => {
    const hasChildren = !!(node.children && node.children.length);
    const isExpanded = !!expanded[node.id];
    const selectedId = String(selectedSubId || selectedCategoryId || '');
    const isSelected = selectedId && String(node.id) === selectedId;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded ${isSelected ? 'bg-indigo-50 ring-1 ring-indigo-100' : ''}`}
          style={{ paddingLeft: 8 + depth * 16 }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggle(node.id)}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
              className="text-slate-500 w-6 h-6 flex items-center justify-center"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          ) : (
            <div className="w-6" />
          )}

          <Folder className="w-4 h-4 text-indigo-500" />

          <button onClick={() => onSelect(node)} className="text-sm text-left flex-1">
            {node.name}
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((c) => renderNode(c, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  const selectedLabel = useMemo(() => {
    const id = selectedSubId || selectedCategoryId;
    if (!id) return '';
    const found = flat.find(f => f.node.id === String(id));
    return found ? `${'  '.repeat(found.depth)}${found.node.name}`.trim() : '';
  }, [selectedCategoryId, selectedSubId, flat]);

  return (
    <FormField label="Category">
      <div className="relative">
        <div className="w-full flex items-center gap-2">
          <input readOnly value={selectedLabel} onClick={() => setOpen((s) => !s)} placeholder="Select category" className="w-full h-11 rounded-xl border border-slate-200 bg-white shadow-sm px-3 text-sm" />
          <button type="button" onClick={() => { setValue(name, ''); setValue(subName, ''); }} className="px-3 py-2 text-sm text-slate-500">Clear</button>
        </div>

        {open && (
          <div className="absolute z-50 mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="p-2">
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search..." className="w-full px-3 py-2 rounded-md border text-sm" />
            </div>

            <div>
              {(!pruned || pruned.length === 0) ? (
                <div className="p-3 text-sm text-slate-500">No categories</div>
              ) : (
                pruned.map((n) => renderNode(n, 0))
              )}
            </div>
          </div>
        )}
      </div>
      <Controller name={name} control={control} render={() => <></>} />
    </FormField>
  );
}
