"use client";

import { useFetch } from "../../../hooks/useFetch";
import Card from "../../../components/ui/Card";
import { Users, ShoppingCart, Package, IndianRupee } from "lucide-react";

export default function DashboardPage() {
  const { data: ordersData, loading } = useFetch("/orders/all");
  const { data: products } = useFetch("/products");
  const { data: users } = useFetch("/users");

  // ✅ CALCULATIONS
  const totalOrders = ordersData?.length || 0;
  const totalUsers = users?.length || 0;
  const totalProducts = products?.length || 0;

  const totalRevenue =
    ordersData?.reduce(
      (sum: number, o: any) => sum + Number(o.totalPrice || 0),
      0
    ) || 0;

  const stats = [
    {
      title: "Users",
      value: totalUsers,
      icon: Users,
    },
    {
      title: "Orders",
      value: totalOrders,
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: totalProducts,
      icon: Package,
    },
    {
      title: "Revenue",
      value: `₹${totalRevenue}`,
      icon: IndianRupee,
    },
  ];

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back. Here’s what’s happening today.
          </p>
        </div>

        <button className="
    px-4 py-2 rounded-xl
    bg-gradient-to-r from-indigo-500 to-purple-500
    text-white text-sm font-medium
    shadow hover:opacity-90
  ">
          + Create
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => {
          const Icon = item.icon;

          return (
            <Card key={i} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{item.title}</p>

                <h2 className="text-3xl font-bold mt-2 text-slate-800 dark:text-white">
                  {loading ? "..." : item.value}
                </h2>

                {/* <p className="text-xs text-green-500 mt-1">
            +2.5% from last week
          </p> */}
              </div>

              <div className="
          w-12 h-12 rounded-xl
          bg-gradient-to-tr from-indigo-500 to-purple-500
          flex items-center justify-center
          text-white shadow-md
        ">
                <Icon size={22} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* RECENT ORDERS */}
      <div className="
  bg-white/80 dark:bg-slate-900/80
  backdrop-blur-md
  rounded-2xl
  border border-slate-200/60 dark:border-slate-800
  shadow-sm
  overflow-hidden
">

        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Recent Orders
          </h3>

          <button className="text-sm text-indigo-500 hover:underline">
            View All
          </button>
        </div>

        {/* HEADER */}
        <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-slate-500 border-b bg-slate-50 dark:bg-slate-800/50">
          <div className="col-span-2">Order</div>
          <div className="col-span-4">Customer</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Date</div>
        </div>

        {/* ROWS */}
        {loading ? (
          <div className="text-center py-6 text-slate-500">
            Loading...
          </div>
        ) : (
          (ordersData || []).slice(0, 5).map((o: any) => (
            <div
              key={o.id}
              className="
  grid grid-cols-12 px-6 py-4 items-center
  border-b last:border-none
  hover:bg-slate-50 dark:hover:bg-slate-800/50
  transition
"
            >
              <div className="col-span-2 font-medium">
                #{o.id}
              </div>

              <div className="col-span-4">
                <div className="font-medium">
                  {o.user?.email || "—"}
                </div>
              </div>

              <div className="col-span-2 font-medium">
                ₹{o.totalPrice}
              </div>

              <div className="col-span-2">
                <span
                  className={`
    text-xs px-3 py-1 rounded-full font-medium
    ${o.status === "delivered"
                      ? "bg-green-100 text-green-600"
                      : o.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                    }
  `}
                >
                  {o.status}
                </span>
              </div>

              <div className="col-span-2 text-right text-sm text-slate-500">
                {new Date(o.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}