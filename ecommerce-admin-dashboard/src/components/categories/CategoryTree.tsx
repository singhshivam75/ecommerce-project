"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Folder, PlusCircle, Edit3, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export default function CategoryTree({ nodes, onEdit, onAddChild, onDelete, onReorder }: any) {
  const [items, setItems] = useState(nodes || []);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => setItems(nodes || []), [nodes]);
  useEffect(() => {
    // expand root nodes by default
    const map: Record<string, boolean> = {};
    (nodes || []).forEach((n: any) => (map[n.id] = true));
    setExpanded(map);
  }, [nodes]);

  const findParentArray = (list: any[], id: any): { parentArr: any[]; index: number } | null => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (String(item.id) === String(id)) return { parentArr: list, index: i };
      if (item.children) {
        const res = findParentArray(item.children, id);
        if (res) return res;
      }
    }
    return null;
  };

  const moveUp = (id: any) => {
    const entry = findParentArray(items, id);
    if (!entry) return;
    const { parentArr, index } = entry;
    if (index <= 0) return;
    const tmp = parentArr[index - 1];
    parentArr[index - 1] = parentArr[index];
    parentArr[index] = tmp;
    setItems([...items]);
    onReorder?.({ orderedIds: flatten(items).map((i: any) => i.id) });
  };

  const moveDown = (id: any) => {
    const entry = findParentArray(items, id);
    if (!entry) return;
    const { parentArr, index } = entry;
    if (index >= parentArr.length - 1) return;
    const tmp = parentArr[index + 1];
    parentArr[index + 1] = parentArr[index];
    parentArr[index] = tmp;
    setItems([...items]);
    onReorder?.({ orderedIds: flatten(items).map((i: any) => i.id) });
  };

  const flatten = (list: any[]) => {
    const out: any[] = [];
    const walk = (arr: any[]) => {
      arr.forEach((n: any) => {
        out.push(n);
        if (n.children && n.children.length) walk(n.children);
      });
    };
    walk(list);
    return out;
  };

  // const allIds = (list: any[]) => {
  //   const out: any[] = [];
  //   const walk = (arr: any[]) => {
  //     arr.forEach((n: any) => {
  //       out.push(n.id);
  //       if (n.children && n.children.length) walk(n.children);
  //     });
  //   };
  //   walk(list);
  //   return out;
  // };

  // const expandAll = () => {
  //   const map: Record<string, boolean> = {};
  //   allIds(items).forEach((id) => (map[id] = true));
  //   setExpanded(map);
  // };

  // const collapseAll = () => setExpanded({});

  const toggle = (id: any) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="space-y-2">
      {/* <div className="flex justify-end gap-2">
        <button onClick={expandAll} className="px-3 py-1 text-sm rounded-md border bg-white/60">Expand All</button>
        <button onClick={collapseAll} className="px-3 py-1 text-sm rounded-md border bg-white/60">Collapse All</button>
      </div> */}

      <ul className="space-y-1">
        {items.map((node: any) => (
          <li key={node.id} className="py-1">
            <div className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <button onClick={() => (node.children && node.children.length ? toggle(node.id) : null)} className="text-slate-400">
                  {node.children && node.children.length ? (
                    <ChevronDown className={`w-4 h-4 transform ${expanded[node.id] ? '' : '-rotate-90'}`} />
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </button>

                <Folder className="w-5 h-5 text-indigo-500" />

                <div className="flex flex-col">
                  <div className="text-sm font-medium">{node.name}</div>
                  <div className="text-xs text-slate-400">{node.slug}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="hidden sm:block text-xs text-slate-500">{(node.children?.length ?? 0)} children</div>
                {node.isActive ? <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs">Active</div> : <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs">Inactive</div>}

                <button title="Add" className="text-indigo-600" onClick={() => onAddChild(node)}><PlusCircle className="w-4 h-4" /></button>
                <button title="Edit" className="text-slate-600" onClick={() => onEdit(node)}><Edit3 className="w-4 h-4" /></button>
                <button title="Delete" className="text-rose-600" onClick={() => onDelete(node)}><Trash2 className="w-4 h-4" /></button>
                <button title="Move up" className="text-slate-400" onClick={() => moveUp(node.id)}><ArrowUp className="w-4 h-4" /></button>
                <button title="Move down" className="text-slate-400" onClick={() => moveDown(node.id)}><ArrowDown className="w-4 h-4" /></button>
              </div>
            </div>

            {node.children && node.children.length > 0 && expanded[node.id] && (
              <div className="mt-1 ml-6 pl-4 border-l border-slate-100">
                <CategoryTree nodes={node.children} onEdit={onEdit} onAddChild={onAddChild} onDelete={onDelete} onReorder={onReorder} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
