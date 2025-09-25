import { sanityClient } from "./sanity";
import {
  getProducts as getShopifyProducts,
  type Product as ShopifyProduct,
} from "./shopify";

export interface SanityProduct {
  _id?: string;
  _type: "product";
  shopifyId: string;
  title: string;
  handle: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: Array<{
    url: string;
    altText?: string;
    isPrimary?: boolean;
  }>;
  variants: Array<{
    shopifyVariantId: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    sku?: string;
    quantity?: number;
    availableForSale: boolean;
  }>;
  tags?: string[];
  category?: string;
  featured?: boolean;
  availableForSale: boolean;
  seoTitle?: string;
  seoDescription?: string;
  lastSynced: string;
}

export async function syncProductsFromShopify(): Promise<{
  success: boolean;
  synced: number;
  errors: string[];
}> {
  console.log("🔄 Starting Shopify to Sanity sync...");

  const errors: string[] = [];
  let synced = 0;

  try {
    // Get all products from Shopify
    const shopifyProducts = await getShopifyProducts();
    console.log(`📦 Found ${shopifyProducts.length} products in Shopify`);

    // Get existing products from Sanity
    const existingProducts = await sanityClient.fetch<SanityProduct[]>(
      `*[_type == "product"] { _id, shopifyId }`
    );
    const existingShopifyIds = new Set(
      existingProducts.map((p) => p.shopifyId)
    );

    console.log(
      `📋 Found ${existingProducts.length} existing products in Sanity`
    );

    for (const shopifyProduct of shopifyProducts) {
      try {
        const sanityProduct = convertShopifyToSanity(shopifyProduct);

        // Check if product already exists
        const existingProduct = existingProducts.find(
          (p) => p.shopifyId === sanityProduct.shopifyId
        );

        if (existingProduct && existingProduct._id) {
          // Update existing product
          await sanityClient
            .patch(existingProduct._id)
            .set(sanityProduct)
            .commit();
          console.log(`✅ Updated product: ${sanityProduct.title}`);
        } else {
          // Create new product
          await sanityClient.create(sanityProduct);
          console.log(`➕ Created product: ${sanityProduct.title}`);
        }

        synced++;
      } catch (error) {
        const errorMsg = `Failed to sync product ${shopifyProduct.name}: ${
          error instanceof Error ? error.message : String(error)
        }`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    // Remove products that no longer exist in Shopify
    const shopifyIds = new Set(shopifyProducts.map((p) => p.id));
    const productsToRemove = existingProducts.filter(
      (p) => !shopifyIds.has(p.shopifyId)
    );

    for (const productToRemove of productsToRemove) {
      try {
        if (productToRemove._id) {
          await sanityClient.delete(productToRemove._id);
          console.log(`🗑️ Removed product: ${productToRemove.shopifyId}`);
        }
      } catch (error) {
        const errorMsg = `Failed to remove product ${
          productToRemove.shopifyId
        }: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    console.log(
      `🎉 Sync completed! Synced: ${synced}, Errors: ${errors.length}`
    );

    return {
      success: errors.length === 0,
      synced,
      errors,
    };
  } catch (error) {
    const errorMsg = `Sync failed: ${
      error instanceof Error ? error.message : String(error)
    }`;
    console.error(`❌ ${errorMsg}`);
    return {
      success: false,
      synced,
      errors: [errorMsg, ...errors],
    };
  }
}

function convertShopifyToSanity(shopifyProduct: ShopifyProduct): SanityProduct {
  const now = new Date().toISOString();

  return {
    _type: "product",
    shopifyId: shopifyProduct.id,
    title: shopifyProduct.name,
    handle: shopifyProduct.slug,
    description: shopifyProduct.description || "",
    shortDescription:
      shopifyProduct.description?.substring(0, 150) +
      (shopifyProduct.description && shopifyProduct.description.length > 150
        ? "..."
        : ""),
    price: shopifyProduct.priceCents,
    compareAtPrice: shopifyProduct.compareAtPriceCents,
    currency: "USD", // Default to USD, could be made dynamic
    images: shopifyProduct.images.map((url, index) => ({
      url,
      altText: shopifyProduct.name,
      isPrimary: index === 0,
    })),
    variants: [], // Shopify variants would need to be fetched separately
    tags: [], // Could be extracted from Shopify tags
    category: "other", // Default category
    featured: false,
    availableForSale: shopifyProduct.availableForSale ?? true,
    seoTitle: shopifyProduct.name,
    seoDescription: shopifyProduct.description?.substring(0, 160),
    lastSynced: now,
  };
}

export async function getProductsFromSanity(): Promise<SanityProduct[]> {
  try {
    console.log("🔍 Fetching products from Sanity...");
    const products = await sanityClient.fetch<SanityProduct[]>(
      `*[_type == "product"] | order(_createdAt desc) {
        _id,
        shopifyId,
        title,
        handle,
        description,
        shortDescription,
        price,
        compareAtPrice,
        currency,
        images,
        variants,
        tags,
        category,
        featured,
        availableForSale,
        seoTitle,
        seoDescription,
        lastSynced
      }`
    );
    console.log(`✅ Found ${products.length} products in Sanity`);
    return products;
  } catch (error) {
    console.error("❌ Error fetching products from Sanity:", error);
    return [];
  }
}

export async function getProductFromSanity(
  handle: string
): Promise<SanityProduct | null> {
  try {
    console.log(`🔍 Fetching product from Sanity: ${handle}`);
    const product = await sanityClient.fetch<SanityProduct>(
      `*[_type == "product" && handle == "${handle}"][0] {
        _id,
        shopifyId,
        title,
        handle,
        description,
        shortDescription,
        price,
        compareAtPrice,
        currency,
        images,
        variants,
        tags,
        category,
        featured,
        availableForSale,
        seoTitle,
        seoDescription,
        lastSynced
      }`
    );
    return product || null;
  } catch (error) {
    console.error(`❌ Error fetching product from Sanity: ${error}`);
    return null;
  }
}

export async function getFeaturedProductsFromSanity(): Promise<
  SanityProduct[]
> {
  try {
    console.log("🔍 Fetching featured products from Sanity...");
    const products = await sanityClient.fetch<SanityProduct[]>(
      `*[_type == "product" && featured == true] | order(_createdAt desc) {
        _id,
        shopifyId,
        title,
        handle,
        description,
        shortDescription,
        price,
        compareAtPrice,
        currency,
        images,
        variants,
        tags,
        category,
        featured,
        availableForSale,
        seoTitle,
        seoDescription,
        lastSynced
      }`
    );
    console.log(`✅ Found ${products.length} featured products in Sanity`);
    return products;
  } catch (error) {
    console.error("❌ Error fetching featured products from Sanity:", error);
    return [];
  }
}
