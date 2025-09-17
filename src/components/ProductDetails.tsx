"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiHeart,
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  compareAtPriceCents?: number;
  imageUrl: string;
  images?: string[];
  category?: string;
  stock?: number;
  availableForSale?: boolean;
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  // Log navigation completion time
  React.useEffect(() => {
    const navStartTime = sessionStorage.getItem("navStartTime");
    if (navStartTime) {
      const endTime = performance.now();
      const navigationTime = endTime - parseFloat(navStartTime);
      console.log(`⚡ Navigation completed in ${navigationTime.toFixed(2)}ms`);
      console.log(`📊 Product ${product.id} loaded at ${endTime.toFixed(2)}ms`);

      // Clear the stored time
      sessionStorage.removeItem("navStartTime");

      // Log performance rating
      if (navigationTime < 50) {
        console.log(`🔥 LIGHTNING FAST! Under 50ms`);
      } else if (navigationTime < 100) {
        console.log(`⚡ Very Fast! Under 100ms`);
      } else if (navigationTime < 200) {
        console.log(`✅ Fast! Under 200ms`);
      } else {
        console.log(`⚠️ Slow: ${navigationTime.toFixed(2)}ms`);
      }
    }
  }, [product.id]);

  const images = product.images || [product.imageUrl];
  const currentImage = images[currentImageIndex];

  // Preload all images for instant switching
  React.useEffect(() => {
    images.forEach((imageUrl) => {
      const img = new window.Image();
      img.src = imageUrl;
    });
  }, [images]);

  const formatPrice = (priceCents: number) => {
    return `R ${(priceCents / 100).toFixed(2)}`;
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", product.name, "Quantity:", quantity);
    // TODO: Implement add to cart functionality
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">In Stock</span>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images - Enhanced */}
          <div className="space-y-6">
            {/* Main Image with Modern Design */}
            <div
              className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200 group shadow-lg cursor-grab active:cursor-grabbing"
              onTouchStart={(e) => {
                if (images.length <= 1) return;

                const touch = e.touches[0];
                const startX = touch.clientX;

                const handleTouchEnd = (e: TouchEvent) => {
                  const touch = e.changedTouches[0];
                  const endX = touch.clientX;
                  const diff = startX - endX;

                  if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                      nextImage();
                    } else {
                      prevImage();
                    }
                  }

                  document.removeEventListener("touchend", handleTouchEnd);
                };

                document.addEventListener("touchend", handleTouchEnd);
              }}
              onMouseDown={(e) => {
                if (images.length <= 1) return;
                setIsDragging(true);
                setDragStart(e.clientX);
              }}
              onMouseUp={(e) => {
                if (!isDragging || images.length <= 1) return;

                const diff = dragStart - e.clientX;
                if (Math.abs(diff) > 50) {
                  if (diff > 0) {
                    nextImage();
                  } else {
                    prevImage();
                  }
                }
                setIsDragging(false);
              }}
              onMouseLeave={() => setIsDragging(false)}
            >
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-contain transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                quality={95}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Image Navigation - Modern */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
                    aria-label="Previous image"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                    aria-label="Next image"
                  >
                    <FiArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </>
              )}

              {/* Animated Dots Indicator */}
              {images.length > 1 && (
                <div className="absolute top-4 right-4 flex space-x-2 z-10">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-white shadow-lg scale-125"
                          : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Images - Enhanced */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                      index === currentImageIndex
                        ? "border-gray-900 scale-105 shadow-lg"
                        : "border-gray-200 hover:border-gray-400 hover:scale-105"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Modern Design */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="space-y-3">
              {/* Category */}
              {product.category && (
                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                  {product.category}
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.priceCents)}
                </span>
                {product.compareAtPriceCents && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.compareAtPriceCents)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                      Save{" "}
                      {Math.round(
                        ((product.compareAtPriceCents - product.priceCents) /
                          product.compareAtPriceCents) *
                          100
                      )}
                      %
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector - Modern */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-gray-900">
                Quantity
              </h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-base py-2 border-x border-gray-300 text-gray-900 bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {product.availableForSale === false
                    ? "Out of stock"
                    : product.stock
                    ? `${product.stock} available in stock`
                    : "In stock"}
                </span>
              </div>
            </div>

            {/* Action Buttons - Modern */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <button
                  onClick={handleWishlistToggle}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isWishlisted
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-500"
                  }`}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <FiHeart
                    className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-gray-900 to-black text-white py-3 px-4 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>

              <button className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105">
                Buy Now
              </button>
            </div>

            {/* Product Features - Compact */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Product Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU</span>
                  <span className="text-gray-900 font-mono">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="text-gray-900">
                    {product.category || "General"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock</span>
                  <span className="text-gray-900">
                    {product.availableForSale === false
                      ? "Out of stock"
                      : product.stock
                      ? `${product.stock} available`
                      : "Available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
