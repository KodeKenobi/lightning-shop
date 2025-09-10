"use client";

import { useState, useCallback } from "react";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const handlePageChange = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "products":
        return <ProductsPage />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onPageChange={handlePageChange} />

      <main className="relative">
        <PageTransition isVisible={true}>{renderPage()}</PageTransition>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-2xl">⚡</span>
              <span className="font-bold text-gray-900">Lightning Shop</span>
            </div>
            <div className="text-sm text-gray-500 text-center md:text-right">
              <p>Built with Next.js, React Query, Prisma & Tailwind CSS</p>
              <p className="mt-1">
                © 2024 Lightning Shop. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
