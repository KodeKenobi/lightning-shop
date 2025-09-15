"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Image from "next/image";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  images?: string[];
};

interface PromoCategoriesSectionProps {
  products?: Product[];
}

const categories = Array.from({ length: 6 }, (_, i) => ({ id: i + 1 }));

export default function PromoCategoriesSection({
  products,
}: PromoCategoriesSectionProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const categoriesPerView = 3;

  const firstProduct = products?.[0];
  const productImages = (
    firstProduct?.images?.length 
      ? firstProduct.images 
      : firstProduct?.imageUrl 
        ? [firstProduct.imageUrl] 
        : []
  ) as string[];

  const nextCategories = () => {
    setCurrentCategoryIndex((prev) =>
      Math.min(prev + 1, categories.length - categoriesPerView)
    );
  };

  const prevCategories = () => {
    setCurrentCategoryIndex((prev) => Math.max(prev - 1, 0));
  };

  // Image navigation functions
  const nextImage = () => {
    if (productImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }
  };

  const prevImage = () => {
    if (productImages.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + productImages.length) % productImages.length
      );
    }
  };

  const visibleCategories = categories.slice(
    currentCategoryIndex,
    currentCategoryIndex + categoriesPerView
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 items-end">
          {/* Left side - Promo Product Card - EXACTLY as described */}
          <div className="bg-white border border-black rounded-2xl p-6 max-w-sm mx-auto lg:mx-0">
            {/* Product Image Carousel */}
            <div className="relative aspect-[4/3] bg-white rounded-xl mb-4 overflow-hidden group">
              {productImages && productImages.length > 0 ? (
                <>
                  <Image
                    src={productImages[currentImageIndex]}
                    alt={firstProduct?.name || "Product image"}
                    fill
                    className="object-contain transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />

                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                        aria-label="Previous image"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                        aria-label="Next image"
                      >
                        <FiChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="relative">
                    {/* Fallback mountain icon */}
                    <div className="absolute -left-8 -top-4 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-gray-400"></div>
                    <div className="absolute left-0 top-0 w-0 h-0 border-l-[32px] border-r-[32px] border-b-[48px] border-l-transparent border-r-transparent border-b-gray-500"></div>
                    <div className="absolute -right-4 -top-2 w-8 h-8 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Image dots indicator */}
            {productImages && productImages.length > 1 && (
              <div className="flex justify-center mb-3 space-x-2">
                {productImages.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex
                        ? "bg-gray-900 w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Product title - centered, bold, black */}
            <h3 className="text-xl font-bold text-black text-center mb-3">
              {firstProduct?.name || "Promo Product"}
            </h3>

            {/* Thin horizontal line separator */}
            <div className="w-full h-px bg-gray-300 mb-4"></div>

            {/* Buy button - 60-70% width, black background, white text */}
            <div className="text-center">
              <button className="bg-black text-white px-12 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors w-3/4">
                Buy
              </button>
            </div>
          </div>
          {/* Right side - Browse Popular Categories - EXACTLY as described */}
          <div className="space-y-8">
            {/* Title - large, bold, black, centered above the 3 cards */}
            <h2 className="text-3xl font-bold text-black text-center">
              Browse Popular Categories
            </h2>

            {/* Carousel with navigation arrows and 3 visible cards */}
            <div className="flex space-x-4">
              {/* Left arrow - simple gray chevron, no background */}
              <button
                onClick={prevCategories}
                disabled={currentCategoryIndex === 0}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>

              {/* Three category cards - EVEN BIGGER */}
              <div className="flex space-x-6">
                {visibleCategories.map((category) => (
                  <div
                    key={category.id}
                    className="w-48 h-48 border border-black rounded-xl bg-white flex flex-col items-center justify-center p-5"
                  >
                    {/* Small mountain icon - scaled down version */}
                    <div className="relative mb-4">
                      <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[18px] border-l-transparent border-r-transparent border-b-gray-400"></div>
                      <div className="absolute left-0 top-0 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[15px] border-l-transparent border-r-transparent border-b-gray-500"></div>
                      <div className="absolute -right-1 -top-1 w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    {/* Category text - small, black, centered */}
                    <span className="text-lg text-black text-center">
                      Category
                    </span>
                  </div>
                ))}
              </div>

              {/* Right arrow - simple gray chevron, no background */}
              <button
                onClick={nextCategories}
                disabled={
                  currentCategoryIndex >= categories.length - categoriesPerView
                }
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>{" "}
        </div>
      </div>
    </section>
  );
}
