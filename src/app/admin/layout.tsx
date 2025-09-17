import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64">{children}</main>
      </div>
    </div>
  );
}
