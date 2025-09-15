"use client";

import { useState } from "react";
import ProductImageCarousel from "./ProductImageCarousel";
import Button from "./Button";
import { FiHeart } from "react-icons/fi";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
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
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (priceCents: number) => {
    // Use consistent formatting to avoid hydration mismatch
    const price = (priceCents / 100).toFixed(2);
    return `R ${price}`;
  };

  const images = product.images || [product.imageUrl];

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(product);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      <div className="relative">
        <ProductImageCarousel
          images={images}
          alt={product.name}
          productName={product.name}
        />

        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={handleWishlistToggle}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
            }`}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <FiHeart
              className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-3 flex-1">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(product.priceCents)}
          </div>

          <Button
            onClick={() => onAddToCart?.(product)}
            variant="primary"
            size="sm"
            width="medium"
            className="text-xs px-3 py-1.5"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
