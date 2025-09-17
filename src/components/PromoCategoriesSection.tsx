"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight, FiZap } from "react-icons/fi";
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

const categories = [
  {
    id: 1,
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop&crop=center",
    color: "from-blue-500 to-purple-600",
  },
  {
    id: 2,
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: 3,
    name: "Home",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: 4,
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
    color: "from-orange-500 to-red-600",
  },
  {
    id: 5,
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&crop=center",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 6,
    name: "Books",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&crop=center",
    color: "from-indigo-500 to-blue-600",
  },
];

export default function PromoCategoriesSection({
  products,
}: PromoCategoriesSectionProps) {
  const router = useRouter();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const categoriesPerView = 3;

  // Use all products instead of just the first one
  const availableProducts = products || [];
  const currentProduct = availableProducts[currentProductIndex];
  const productImages = (
    currentProduct?.images?.length
      ? currentProduct.images
      : currentProduct?.imageUrl
      ? [currentProduct.imageUrl]
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

  // Product navigation functions
  const nextProduct = () => {
    if (availableProducts.length > 1) {
      setCurrentProductIndex((prev) => (prev + 1) % availableProducts.length);
      setCurrentImageIndex(0); // Reset image index when switching products
    }
  };

  const prevProduct = () => {
    if (availableProducts.length > 1) {
      setCurrentProductIndex(
        (prev) =>
          (prev - 1 + availableProducts.length) % availableProducts.length
      );
      setCurrentImageIndex(0); // Reset image index when switching products
    }
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

  const handleProductClick = () => {
    if (currentProduct) {
      router.push(`/products/${currentProduct.id}`);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    // Navigate to category page or filter products
    console.log(`Navigate to ${categoryName} category`);
    // You can implement category filtering or navigation here
  };

  const visibleCategories = categories.slice(
    currentCategoryIndex,
    currentCategoryIndex + categoriesPerView
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 items-end">
          {/* Left side - Promo Product Card - Modern Design */}
          <div
            onClick={handleProductClick}
            className="group relative bg-white border border-gray-200 rounded-3xl p-6 max-w-sm mx-auto lg:mx-0 cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
          >
            {/* Product Navigation Controls */}
            {availableProducts.length > 1 && (
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevProduct();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Previous product"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-500">
                  {currentProductIndex + 1} of {availableProducts.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextProduct();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Next product"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Product Image Carousel */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-6 overflow-hidden group">
              {productImages && productImages.length > 0 ? (
                <>
                  <Image
                    src={productImages[currentImageIndex]}
                    alt={currentProduct?.name || "Product image"}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
                        aria-label="Previous image"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
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
                    {/* Modern fallback icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <FiZap className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Image dots indicator */}
            {productImages && productImages.length > 1 && (
              <div className="flex justify-center mb-4 space-x-2">
                {productImages.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
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

            {/* Product title - modern typography */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-3 leading-tight">
              {currentProduct?.name || "Featured Product"}
            </h3>

            {/* Product price with discount */}
            {currentProduct?.priceCents && (
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    R {(currentProduct.priceCents / 100).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    R {((currentProduct.priceCents / 100) * 1.2).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-green-600 font-semibold mt-1">
                  Save 20% Today!
                </div>
              </div>
            )}

            {/* Modern separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6"></div>

            {/* Buy button - modern design */}
            <div className="text-center">
              <button className="bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-2xl font-bold hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full">
                Shop Now
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

              {/* Three category cards - Enhanced Design */}
              <div className="flex space-x-6">
                {visibleCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryClick(category.name)}
                    className="group w-56 h-56 rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl cursor-pointer relative"
                  >
                    {/* Background Image */}
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="224px"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Category Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <span className="text-lg font-bold text-white text-center block drop-shadow-lg">
                        {category.name}
                      </span>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-300"></div>
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
