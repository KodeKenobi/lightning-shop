"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiSettings,
  FiPlus,
} from "react-icons/fi";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: FiHome },
    { href: "/admin/products", label: "Products", icon: FiPackage },
    { href: "/admin/products/new", label: "Add Product", icon: FiPlus },
    { href: "/admin/orders", label: "Orders", icon: FiShoppingCart },
    { href: "/admin/customers", label: "Customers", icon: FiUsers },
    { href: "/admin/settings", label: "Settings", icon: FiSettings },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Lightning Shop</h1>
        <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
