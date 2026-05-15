"use client";

import { useState } from "react";
import { UsersAPI } from "../../../lib/users.api";
import toast from "react-hot-toast";

export default function CreateUserModal({ onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Required fields missing");
      return;
    }

    setLoading(true);
    try {
      await UsersAPI.create(form);
      toast.success("User created");
      onSuccess();
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full px-4 py-2.5 rounded-xl
    bg-slate-100 dark:bg-slate-800
    focus:ring-2 focus:ring-indigo-200
    outline-none text-sm
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="
        relative w-full max-w-md p-6
        rounded-2xl
        bg-white/90 dark:bg-slate-900/90
        backdrop-blur-xl
        border border-slate-200/60 dark:border-slate-800
        shadow-2xl
      ">
        <h3 className="text-xl font-semibold mb-5">
          Create User
        </h3>

        <div className="space-y-4">
          <input placeholder="Name" className={inputClass}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input placeholder="Email" className={inputClass}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input type="password" placeholder="Password" className={inputClass}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <input placeholder="Mobile" className={inputClass}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />

          <select className={inputClass}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={onClose} className="text-sm text-slate-500">
            Cancel
          </button>

          <button
            onClick={submit}
            className="
              px-5 py-2 rounded-xl
              bg-gradient-to-r from-indigo-500 to-purple-500
              text-white text-sm font-medium
            "
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}