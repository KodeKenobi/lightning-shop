"use client";

import { useState, useCallback } from "react";
import Header from "./Header";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

interface HeroData {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  image?: {
    asset?: { _ref: string };
    alt?: string;
    [key: string]: unknown;
  };
}

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  images?: string[];
};

interface AppProps {
  initialHeroData?: HeroData;
  initialProductsData?: Product[];
}

export default function App({
  initialHeroData,
  initialProductsData,
}: AppProps) {
  const [currentPage, setCurrentPage] = useState("home");

  const handlePageChange = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            initialHeroData={initialHeroData}
            initialProductsData={initialProductsData}
          />
        );
      case "products":
        return <ProductsPage initialProductsData={initialProductsData} />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      default:
        return (
          <HomePage
            initialHeroData={initialHeroData}
            initialProductsData={initialProductsData}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentPage={currentPage}
        onPageChange={handlePageChange}
        cartItemCount={0}
      />

      <main className="relative">
        <PageTransition isVisible={true}>{renderPage()}</PageTransition>
      </main>

      <Footer />
    </div>
  );
}
