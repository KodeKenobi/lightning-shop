"use client";

import { useState } from "react";
import { FiUpload, FiX, FiPlus } from "react-icons/fi";

interface ProductData {
  title: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  price: string;
  compareAtPrice: string;
  costPerItem: string;
  sku: string;
  barcode: string;
  trackQuantity: boolean;
  quantity: string;
  continueSelling: boolean;
  physicalProduct: boolean;
  weight: string;
  weightUnit: "kg" | "lb" | "oz" | "g";
  seoTitle: string;
  seoDescription: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  images: File[];
}

export default function ProductForm() {
  const [productData, setProductData] = useState<ProductData>({
    title: "",
    description: "",
    productType: "",
    vendor: "",
    tags: [],
    price: "",
    compareAtPrice: "",
    costPerItem: "",
    sku: "",
    barcode: "",
    trackQuantity: true,
    quantity: "0",
    continueSelling: false,
    physicalProduct: true,
    weight: "0.0",
    weightUnit: "kg",
    seoTitle: "",
    seoDescription: "",
    status: "ACTIVE",
    images: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ProductData, value: string | number | boolean) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index: number) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !productData.tags.includes(tagInput.trim())) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", productData.title);
      formData.append("description", productData.description);
      formData.append("productType", productData.productType);
      formData.append("vendor", productData.vendor);
      formData.append("tags", JSON.stringify(productData.tags));
      formData.append("price", productData.price);
      formData.append("compareAtPrice", productData.compareAtPrice);
      formData.append("costPerItem", productData.costPerItem);
      formData.append("sku", productData.sku);
      formData.append("barcode", productData.barcode);
      formData.append("trackQuantity", productData.trackQuantity.toString());
      formData.append("quantity", productData.quantity);
      formData.append(
        "continueSelling",
        productData.continueSelling.toString()
      );
      formData.append(
        "physicalProduct",
        productData.physicalProduct.toString()
      );
      formData.append("weight", productData.weight);
      formData.append("weightUnit", productData.weightUnit);
      formData.append("seoTitle", productData.seoTitle);
      formData.append("seoDescription", productData.seoDescription);
      formData.append("status", productData.status);

      productData.images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const productId = result.product.id;

        // Upload images if any
        if (productData.images.length > 0) {
          console.log(
            `Uploading ${productData.images.length} images for product ${productId}`
          );

          for (let i = 0; i < productData.images.length; i++) {
            const image = productData.images[i];
            console.log(
              `Processing image ${i + 1}: ${image.name} (${image.size} bytes, ${
                image.type
              })`
            );

            const imageFormData = new FormData();
            imageFormData.append("file", image);
            imageFormData.append("productId", productId.toString());

            try {
              console.log(`Sending image ${i + 1} to upload endpoint...`);
              const imageResponse = await fetch(
                "/api/admin/products/upload-image",
                {
                  method: "POST",
                  body: imageFormData,
                }
              );

              console.log(
                `Image ${i + 1} response status: ${imageResponse.status}`
              );

              if (imageResponse.ok) {
                const imageResult = await imageResponse.json();
                console.log(
                  `Image ${i + 1} uploaded successfully:`,
                  imageResult
                );
              } else {
                const errorResult = await imageResponse.json();
                console.error(`Failed to upload image ${i + 1}:`, errorResult);
              }
            } catch (imageError) {
              console.error(`Error uploading image ${i + 1}:`, imageError);
            }
          }
        }

        alert("Product created successfully!");
        setProductData({
          title: "",
          description: "",
          productType: "",
          vendor: "",
          tags: [],
          price: "",
          compareAtPrice: "",
          costPerItem: "",
          sku: "",
          barcode: "",
          trackQuantity: true,
          quantity: "0",
          continueSelling: false,
          physicalProduct: true,
          weight: "0.0",
          weightUnit: "kg",
          seoTitle: "",
          seoDescription: "",
          status: "ACTIVE",
          images: [],
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={productData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type
            </label>
            <input
              type="text"
              value={productData.productType}
              onChange={(e) => handleInputChange("productType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendor
            </label>
            <input
              type="text"
              value={productData.vendor}
              onChange={(e) => handleInputChange("vendor", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FiPlus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {productData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={productData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Media</h2>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Upload files
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <p className="mt-1 text-sm text-gray-500">
              Accepts images, videos, or 3D models
            </p>
          </div>
        </div>

        {productData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {productData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FiX className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pricing</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={productData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compare-at price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={productData.compareAtPrice}
                onChange={(e) =>
                  handleInputChange("compareAtPrice", e.target.value)
                }
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost per item
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={productData.costPerItem}
                onChange={(e) =>
                  handleInputChange("costPerItem", e.target.value)
                }
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={true}
              readOnly
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Charge tax on this product
            </span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Inventory</h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={productData.trackQuantity}
              onChange={(e) =>
                handleInputChange("trackQuantity", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Track quantity</span>
          </div>

          {productData.trackQuantity && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={productData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop location
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Main warehouse</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={productData.continueSelling}
              onChange={(e) =>
                handleInputChange("continueSelling", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Continue selling when out of stock
            </span>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={true}
              readOnly
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              This product has a SKU or barcode
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                value={productData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode
              </label>
              <input
                type="text"
                value={productData.barcode}
                onChange={(e) => handleInputChange("barcode", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Shipping</h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={productData.physicalProduct}
              onChange={(e) =>
                handleInputChange("physicalProduct", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              This is a physical product
            </span>
          </div>

          {productData.physicalProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product weight
                </label>
                <div className="flex">
                  <input
                    type="number"
                    step="0.1"
                    value={productData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={productData.weightUnit}
                    onChange={(e) =>
                      handleInputChange("weightUnit", e.target.value)
                    }
                    className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                    <option value="g">g</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Search engine listing</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={productData.seoTitle}
              onChange={(e) => handleInputChange("seoTitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Description
            </label>
            <textarea
              value={productData.seoDescription}
              onChange={(e) =>
                handleInputChange("seoDescription", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Status</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={productData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </div>
    </form>
  );
}
