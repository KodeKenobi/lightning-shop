"use client";

import { useState } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import Button from "./Button";

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  cartItemCount?: number;
}

export default function Header({
  currentPage,
  onPageChange,
  cartItemCount = 0,
}: HeaderProps) {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "products", label: "Shop" },
    { id: "contact", label: "Contact Us" },
  ];

  return (
    <header className="bg-white border-t-2 border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onPageChange("home")}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 font-bold text-black hover:bg-gray-50 transition-colors"
          >
            Logo
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`text-black font-medium hover:text-gray-600 transition-colors relative ${
                  currentPage === item.id ? "text-gray-600" : ""
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <div className="absolute left-0 right-0 h-0.5 bg-black -bottom-2"></div>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => onPageChange("products")}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Shopping cart"
              >
                <FiShoppingCart className="w-6 h-6" />
              </button>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Wishlist"
              >
                <FiHeart className="w-6 h-6" />
              </button>
            </div>

            <Button width="medium">Button</Button>
          </div>
        </div>

        <div className="md:hidden py-4 border-t border-gray-200">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`text-left py-2 font-medium transition-colors relative ${
                  currentPage === item.id
                    ? "text-gray-600"
                    : "text-black hover:text-gray-600"
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black -bottom-1"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
