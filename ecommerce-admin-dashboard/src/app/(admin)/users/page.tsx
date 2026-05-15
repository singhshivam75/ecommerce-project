"use client";

import { useEffect, useState } from "react";
import { UsersAPI } from "../../../lib/users.api";
import toast from "react-hot-toast";

import DataTable from "../../../components/table/DataTable";
import TableSearch from "../../../components/table/TableSearch";
import TablePagination from "../../../components/table/TablePagination";
import { useTableQuery } from "../../../hooks/useTableQuery";

import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";

export default function UsersPage() {
  const { query, setQuery } = useTableQuery();
  const [users, setUsers] = useState<any[]>([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await UsersAPI.getAll(query);
      setUsers(res.data.data);
      setMeta(res.data.meta);
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query]);

  const columns = [
    {
      key: "name",
      title: "User",
      className: "col-span-3",
      render: (u: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
            {u.name?.charAt(0)}
          </div>
          {u.name}
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      className: "col-span-4",
    },
    {
      key: "role",
      title: "Role",
      className: "col-span-2",
    },
    {
      key: "actions",
      title: "Actions",
      className: "col-span-3 text-right",
      render: (u: any) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditUser(u)}>Edit</button>
          <button
            onClick={() => setDeleteId(u.id)}
            className="
                    px-3 py-1.5 text-xs rounded-lg
                    bg-red-100 text-red-600 hover:bg-red-200
                  "
          >Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="
            px-4 py-2 rounded-xl
            bg-gradient-to-r from-indigo-500 to-purple-500
            text-white text-sm font-medium
            shadow hover:opacity-90
          "
        >
          + Create
        </button>
      </div>

      <TableSearch
        value={query.search}
        onChange={(val: string) =>
          setQuery({ search: val, page: 1 })
        }
      />

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
      />

      <TablePagination
        page={query.page}
        totalPages={meta.totalPages}
        onChange={(page: number) => setQuery({ page })}
      />

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onSuccess={fetchUsers}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={fetchUsers}
        />
      )}

      {deleteId && (
        <ConfirmModal
          open
          title="Delete User"
          message="Are you sure?"
          onConfirm={async () => {
            await UsersAPI.delete(deleteId);
            fetchUsers();
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}