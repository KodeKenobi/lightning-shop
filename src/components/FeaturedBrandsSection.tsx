"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const brands = [
  {
    id: 1,
    name: "Nike",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png",
  },
  {
    id: 2,
    name: "Adidas",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
  },
  {
    id: 3,
    name: "Apple",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
  },
  {
    id: 4,
    name: "Samsung",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png",
  },
  {
    id: 5,
    name: "Sony",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png",
  },
  {
    id: 6,
    name: "Microsoft",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Microsoft-Logo.png",
  },
  {
    id: 7,
    name: "Google",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Google-Logo.png",
  },
  {
    id: 8,
    name: "Amazon",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
  },
];

export default function FeaturedBrandsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 5;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerView >= brands.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, brands.length - itemsPerView) : prev - 1
    );
  };

  const visibleBrands = brands.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="py-16 bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Featured Brands
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Shop from your favorite trusted brands
          </p>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            aria-label="Previous brands"
          >
            <FiChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            aria-label="Next brands"
          >
            <FiChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Brands Carousel */}
          <div className="flex items-center justify-center space-x-6 px-12">
            {visibleBrands.map((brand) => (
              <div
                key={brand.id}
                className="flex-shrink-0 w-32 h-20 bg-white rounded-2xl border border-gray-200 flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="max-w-24 max-h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(brands.length / itemsPerView) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerView)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / itemsPerView) === index
                    ? "bg-gray-900"
                    : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
