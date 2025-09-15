"use client";

import HeroSection from "../HeroSection";
import PromoCategoriesSection from "../PromoCategoriesSection";
import ProductCard from "../ProductCard";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  images?: string[];
};

interface HeroData {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  image?: {
    alt?: string;
    [key: string]: unknown;
  };
}

interface HomePageProps {
  initialHeroData?: HeroData;
  initialProductsData?: Product[];
}

export default function HomePage({
  initialHeroData,
  initialProductsData,
}: HomePageProps) {
  return (
    <div className="min-h-screen">
      <HeroSection initialHeroData={initialHeroData} />

      <PromoCategoriesSection />

      <section className="py-12 bg-gray-50 min-h-screen flex flex-col">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Discover our curated selection of premium items
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start">
            {initialProductsData?.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(product) => {
                  console.log("Add to cart:", product.name);
                }}
                onViewProduct={(product) => {
                  console.log("View product:", product.name);
                }}
                onToggleWishlist={(product) => {
                  console.log("Toggle wishlist:", product.name);
                }}
              />
            ))}
          </div>

          {initialProductsData && initialProductsData.length > 8 && (
            <div className="text-center mt-8">
              <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
