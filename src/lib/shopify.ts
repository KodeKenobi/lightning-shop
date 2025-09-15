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

export async function getProducts(): Promise<ShopifyProduct[]> {
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
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    console.log("📡 Making request to Shopify...");
    const response = await client.request(query, {
      variables: { first: 50 },
    });

    console.log("🔍 Raw Shopify Response:", JSON.stringify(response, null, 2));
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
          };
        }) => ({
          id: edge.node.id,
          slug: edge.node.handle,
          name: edge.node.title,
          description: edge.node.description || "",
          priceCents: Math.round(
            parseFloat(edge.node.priceRange.minVariantPrice.amount) * 100
          ),
          imageUrl: edge.node.images.edges[0]?.node.url || "",
          images:
            edge.node.images.edges.map(
              (imgEdge: { node: { url: string } }) => imgEdge.node.url
            ) || [],
        })
      ) || [];

    console.log("✅ Processed Products:", products);
    console.log("📊 Total Products Found:", products.length);

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
