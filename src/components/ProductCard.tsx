"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiHeart,
  FiShoppingCart,
  FiEye,
  FiStar,
  FiZap,
  FiChevronLeft,
  FiChevronRight,
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
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewProduct: _onViewProduct, // eslint-disable-line @typescript-eslint/no-unused-vars
  onToggleWishlist,
}: ProductCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (priceCents: number) => {
    const price = (priceCents / 100).toFixed(2);
    return `R ${price}`;
  };

  const images = product.images || [product.imageUrl];
  const currentImage = images[currentImageIndex] || product.imageUrl;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(product);
  };

  const handleCardClick = () => {
    // Log navigation start time
    const startTime = performance.now();
    console.log(
      `🚀 Starting navigation to product ${product.id} at ${startTime.toFixed(
        2
      )}ms`
    );

    // Store start time for measurement
    sessionStorage.setItem("navStartTime", startTime.toString());

    // Instant navigation - no loading states
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.id}`);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full flex flex-col cursor-pointer transform hover:-translate-y-2"
    >
      {/* Image Container with Gradient Overlay */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white hover:bg-black rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white hover:bg-black rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
              aria-label="Next image"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? "bg-black w-6"
                    : "bg-black/40 hover:bg-black/60"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2 mb-1 leading-tight">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-2 flex-1 leading-relaxed">
          {product.description}
        </p>

        {/* Price and Actions */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold text-gray-900">
                {formatPrice(product.priceCents)}
              </div>
              {product.compareAtPriceCents && (
                <div className="text-xs text-gray-500 line-through">
                  {formatPrice(product.compareAtPriceCents)}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-gray-900 to-black text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5"
            >
              <FiShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isWishlisted
                  ? "bg-red-500 text-white shadow-md hover:shadow-lg"
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
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300 pointer-events-none" />
    </div>
  );
}
