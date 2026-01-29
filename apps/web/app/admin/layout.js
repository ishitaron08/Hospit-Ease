"use client";

import AdminSidebar from "@/components/component/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="md:pl-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
