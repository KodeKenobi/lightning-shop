import { Inter } from "next/font/google";
import AdminSidebar from "@/components/admin/AdminSidebar";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1 ml-64">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
