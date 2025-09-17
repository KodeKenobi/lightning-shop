import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: "2024-10",
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
});

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export const shopifyClient = client;

// Aggressive caching for zero-lag performance
const productCache = new Map<string, Product>();
const productsCache = new Map<string, Product[]>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours - maximum cache
const CACHE_KEY = "lightning-products";

// Add request deduplication
const pendingRequests = new Map<string, Promise<Product[]>>();

// Add memory cache for instant access
let memoryCache: Product[] | null = null;
let memoryCacheTime = 0;

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  compareAtPriceCents?: number;
  imageUrl: string;
  images: string[];
  stock?: number;
  availableForSale?: boolean;
};

export async function getProducts(): Promise<Product[]> {
  // Check memory cache first (instantest possible)
  const now = Date.now();
  if (memoryCache && now - memoryCacheTime < CACHE_DURATION) {
    console.log("⚡ Using memory cache - INSTANTEST LOADING!");
    return memoryCache;
  }

  // Check Map cache for instant loading
  const cached = productsCache.get(CACHE_KEY);
  if (cached) {
    console.log("🚀 Using cached products data - INSTANT LOADING!");
    // Update memory cache
    memoryCache = cached;
    memoryCacheTime = now;
    return cached;
  }

  // Check if request is already pending (deduplication)
  const pendingRequest = pendingRequests.get(CACHE_KEY);
  if (pendingRequest) {
    console.log("⏳ Waiting for pending request...");
    return pendingRequest;
  }

  console.log("🛒 Shopify API Request Starting...");
  console.log(
    "  - Store Domain:",
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  );
  console.log("  - API Version: 2024-10");
  console.log(
    "  - Has Token:",
    !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
  );

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

  // Create the request promise
  const requestPromise = (async () => {
    try {
      console.log("📡 Making request to Shopify...");
      const response = await client.request(query, {
        variables: { first: 50 },
      });

      console.log(
        "🔍 Raw Shopify Response:",
        JSON.stringify(response, null, 2)
      );
      console.log("🔍 Response Data:", response.data);
      console.log("🔍 Products Edges:", response.data?.products?.edges);

      const products =
        response.data?.products?.edges?.map(
          (edge: {
            node: {
              id: string;
              handle: string;
              title: string;
              description: string;
              priceRange: { minVariantPrice: { amount: string } };
              images: { edges: { node: { url: string } }[] };
              variants: {
                edges: {
                  node: {
                    compareAtPrice?: { amount: string };
                    quantityAvailable?: number;
                    availableForSale?: boolean;
                  };
                }[];
              };
            };
          }) => ({
            id: edge.node.id.split("/").pop() || edge.node.id, // Extract numeric ID from GraphQL ID
            slug: edge.node.handle,
            name: edge.node.title,
            description: edge.node.description || "",
            priceCents: Math.round(
              parseFloat(edge.node.priceRange.minVariantPrice.amount) * 100
            ),
            compareAtPriceCents: edge.node.variants.edges[0]?.node
              .compareAtPrice?.amount
              ? Math.round(
                  parseFloat(
                    edge.node.variants.edges[0].node.compareAtPrice.amount
                  ) * 100
                )
              : undefined,
            stock: edge.node.variants.edges[0]?.node.quantityAvailable,
            availableForSale:
              edge.node.variants.edges[0]?.node.availableForSale,
            imageUrl: edge.node.images.edges[0]?.node.url || "",
            images:
              edge.node.images.edges.map(
                (imgEdge: { node: { url: string } }) => imgEdge.node.url
              ) || [],
          })
        ) || [];

      console.log("✅ Processed Products:", products);
      console.log("📊 Total Products Found:", products.length);

      // Cache the results for instant future loading
      productsCache.set(CACHE_KEY, products);

      // Update memory cache for instantest access
      memoryCache = products;
      memoryCacheTime = now;

      // Clear cache after duration
      setTimeout(() => {
        productsCache.delete(CACHE_KEY);
        memoryCache = null;
        memoryCacheTime = 0;
      }, CACHE_DURATION);

      return products;
    } catch (error) {
      console.error("❌ Shopify API Error:", error);
      console.error("❌ Error Details:", {
        message: error instanceof Error ? error.message : String(error),
        response: (error as { response?: { data?: unknown } })?.response?.data,
        status: (error as { response?: { status?: number } })?.response?.status,
        statusText: (error as { response?: { statusText?: string } })?.response
          ?.statusText,
      });
      return [];
    } finally {
      // Remove from pending requests
      pendingRequests.delete(CACHE_KEY);
    }
  })();

  // Store the pending request
  pendingRequests.set(CACHE_KEY, requestPromise);

  return requestPromise;
}

// Preload function for instant app startup
export async function preloadProducts(): Promise<void> {
  try {
    console.log("🚀 Preloading products for instant startup...");
    await getProducts();
    console.log("✅ Products preloaded successfully!");
  } catch (error) {
    console.error("❌ Failed to preload products:", error);
  }
}

export async function getProduct(
  handle: string
): Promise<ShopifyProduct | null> {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
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
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await client.request(query, {
      variables: { handle },
    });

    return response.data?.product
      ? {
          ...response.data.product,
          price: response.data.product.priceRange.minVariantPrice,
        }
      : null;
  } catch (error) {
    console.error("Error fetching product from Shopify:", error);
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  // Check memory cache first (instantest possible)
  const now = Date.now();
  if (memoryCache && now - memoryCacheTime < CACHE_DURATION) {
    const product = memoryCache.find((p) => {
      const numericId = p.id.split("/").pop() || p.id;
      return numericId === id || p.id === id;
    });
    if (product) {
      console.log("⚡ Using memory cache for product:", id);
      return product;
    }
  }

  // Check individual product cache
  const cached = productCache.get(id);
  if (cached) {
    console.log("🚀 Using cached product data for:", id);
    return cached;
  }

  console.log("🔍 Fetching single product by ID:", id);

  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
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
        images(first: 3) {
          edges {
            node {
              url
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              compareAtPrice {
                amount
              }
              quantityAvailable
              availableForSale
            }
          }
        }
      }
    }
  `;

  try {
    const response = await client.request(query, {
      variables: { id: `gid://shopify/Product/${id}` },
    });

    if (!response.data?.product) {
      return null;
    }

    const product = response.data.product;

    const productData = {
      id: product.id.split("/").pop() || product.id,
      slug: product.handle,
      name: product.title,
      description: product.description || "",
      priceCents: Math.round(
        parseFloat(product.priceRange.minVariantPrice.amount) * 100
      ),
      compareAtPriceCents: product.variants.edges[0]?.node.compareAtPrice
        ?.amount
        ? Math.round(
            parseFloat(product.variants.edges[0].node.compareAtPrice.amount) *
              100
          )
        : undefined,
      stock: product.variants.edges[0]?.node.quantityAvailable,
      availableForSale: product.variants.edges[0]?.node.availableForSale,
      imageUrl: product.images.edges[0]?.node.url || "",
      images:
        product.images.edges.map(
          (imgEdge: { node: { url: string } }) => imgEdge.node.url
        ) || [],
    };

    // Cache the result
    productCache.set(id, productData);

    // Clear cache after duration
    setTimeout(() => {
      productCache.delete(id);
    }, CACHE_DURATION);

    return productData;
  } catch (error) {
    console.error("❌ Error fetching single product from Shopify:", error);
    return null;
  }
}
