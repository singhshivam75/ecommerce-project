"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import AdminLayout from "../../components/layout/AdminLayout";

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.push("/login");
      }
    }
  }, [user, loading]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}