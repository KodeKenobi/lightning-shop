#!/usr/bin/env node

/**
 * Script to sync products from Shopify to Sanity
 * Run with: node scripts/sync-shopify-to-sanity.js
 */

const { createClient } = require("@sanity/client");
const { createStorefrontApiClient } = require("@shopify/storefront-api-client");
require("dotenv").config({ path: ".env.local" });

// Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
});

// Shopify client
const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: "2024-10",
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
});

async function getShopifyProducts() {
  console.log("🛒 Fetching products from Shopify...");

  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  quantityAvailable
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyClient.request(query, {
      variables: { first: 50 },
    });

    return (
      response.data?.products?.edges?.map((edge) => ({
        id: edge.node.id.split("/").pop() || edge.node.id,
        slug: edge.node.handle,
        name: edge.node.title,
        description: edge.node.description || "",
        priceCents: Math.round(
          parseFloat(edge.node.priceRange.minVariantPrice.amount) * 100
        ),
        compareAtPriceCents: edge.node.variants.edges[0]?.node.compareAtPrice
          ?.amount
          ? Math.round(
              parseFloat(
                edge.node.variants.edges[0].node.compareAtPrice.amount
              ) * 100
            )
          : undefined,
        stock: edge.node.variants.edges[0]?.node.quantityAvailable,
        availableForSale: edge.node.variants.edges[0]?.node.availableForSale,
        imageUrl: edge.node.images.edges[0]?.node.url || "",
        images: edge.node.images.edges.map((imgEdge) => imgEdge.node.url) || [],
      })) || []
    );
  } catch (error) {
    console.error("❌ Error fetching from Shopify:", error);
    throw error;
  }
}

function convertToSanityProduct(shopifyProduct) {
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
    currency: "USD",
    images: shopifyProduct.images.map((url, index) => ({
      url,
      altText: shopifyProduct.name,
      isPrimary: index === 0,
    })),
    variants: [],
    tags: [],
    category: "other",
    featured: false,
    availableForSale: shopifyProduct.availableForSale ?? true,
    seoTitle: shopifyProduct.name,
    seoDescription: shopifyProduct.description?.substring(0, 160),
    lastSynced: now,
  };
}

async function syncProducts() {
  try {
    console.log("🚀 Starting Shopify to Sanity sync...");

    // Get products from Shopify
    const shopifyProducts = await getShopifyProducts();
    console.log(`📦 Found ${shopifyProducts.length} products in Shopify`);

    // Get existing products from Sanity
    const existingProducts = await sanityClient.fetch(
      `*[_type == "product"] { _id, shopifyId }`
    );
    const existingShopifyIds = new Set(
      existingProducts.map((p) => p.shopifyId)
    );

    console.log(
      `📋 Found ${existingProducts.length} existing products in Sanity`
    );

    let synced = 0;
    let errors = [];

    for (const shopifyProduct of shopifyProducts) {
      try {
        const sanityProduct = convertToSanityProduct(shopifyProduct);

        // Check if product already exists
        const existingProduct = existingProducts.find(
          (p) => p.shopifyId === sanityProduct.shopifyId
        );

        if (existingProduct) {
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
        const errorMsg = `Failed to sync product ${shopifyProduct.name}: ${error.message}`;
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
        await sanityClient.delete(productToRemove._id);
        console.log(`🗑️ Removed product: ${productToRemove.shopifyId}`);
      } catch (error) {
        const errorMsg = `Failed to remove product ${productToRemove.shopifyId}: ${error.message}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    console.log(`\n🎉 Sync completed!`);
    console.log(`✅ Synced: ${synced} products`);
    console.log(`❌ Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log("\nErrors:");
      errors.forEach((error) => console.log(`  - ${error}`));
    }
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
}

// Run the sync
syncProducts();
