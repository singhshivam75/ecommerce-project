"use client";

import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { OrdersAPI } from "../../../lib/orders.api";
import toast from "react-hot-toast";
import OrderDetailsModal from "../../../components/ui/OrderDetailsModal";
import { Eye } from "lucide-react";

export default function OrdersPage() {
  const { data, loading, refetch } = useFetch("/orders/all");

  const [updating, setUpdating] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const updateStatus = async (id: number, status: string) => {
    try {
      setUpdating(id);
      await OrdersAPI.updateStatus(id, status);
      toast.success("Order updated");
      refetch();
    } catch {
      toast.error("Failed");
    } finally {
      setUpdating(null);
    }
  };

  const statusStyles: any = {
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">

      {/* HEADER (same as dashboard style) */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Orders
          </h1>
          <p className="text-sm text-slate-500">
            Manage customer orders and track status
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border shadow-sm overflow-hidden">

        {/* HEADER ROW */}
        <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-slate-500 border-b bg-slate-50 dark:bg-slate-800">
          <div className="col-span-2">Order</div>
          <div className="col-span-4">Customer</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* BODY */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">
            Loading orders...
          </div>
        ) : (data || []).length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No orders found
          </div>
        ) : (
          (data || []).map((o: any) => (
            <div
              key={o.id}
              className="grid grid-cols-12 items-center px-5 py-4 border-b hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              {/* ORDER */}
              <div className="col-span-2 font-semibold text-slate-700 dark:text-white">
                #{o.id}
              </div>

              {/* CUSTOMER */}
              <div className="col-span-4">
                <div className="font-medium text-slate-700 dark:text-white">
                  {o.user?.email || "—"}
                </div>
                <div className="text-xs text-slate-400">
                  User ID: {o.user?.id}
                </div>
              </div>

              {/* TOTAL */}
              <div className="col-span-2 font-semibold text-slate-800 dark:text-white">
                ₹{o.totalPrice}
              </div>

              {/* STATUS */}
              <div className="col-span-2">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    statusStyles[o.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {o.status}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="col-span-2 flex justify-end items-center gap-3">

                {/* STATUS DROPDOWN */}
                <select
                  value={o.status}
                  disabled={updating === o.id}
                  onChange={(e) =>
                    updateStatus(o.id, e.target.value)
                  }
                  className="
                    px-3 py-1.5 text-sm rounded-lg
                    bg-slate-100 dark:bg-slate-800
                    outline-none
                    focus:ring-2 focus:ring-indigo-500
                  "
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>

                {/* VIEW BUTTON */}
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="
                    p-2 rounded-lg
                    bg-indigo-100 text-indigo-600
                    hover:bg-indigo-200
                    transition
                  "
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}