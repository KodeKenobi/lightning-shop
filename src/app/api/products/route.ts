import { NextResponse } from "next/server";
import { getProducts } from "@/lib/shopify";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("�� Starting product fetch...");
    console.log("📡 Environment variables:");
    console.log(
      "  - Store Domain:",
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
    );
    console.log(
      "  - Has Token:",
      !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
    );
    console.log(
      "  - Token Length:",
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN?.length || 0
    );

    const products = await getProducts();
    console.log("✅ Products from Shopify:", JSON.stringify(products, null, 2));
    console.log("📊 Number of products:", products.length);

    return NextResponse.json(
      {
        products: products,
        debug: {
          environment: {
            domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
            hasToken: !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
            tokenLength:
              process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN?.length || 0,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
    });
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error),
        environment: {
          domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
          hasToken: !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
          tokenLength:
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN?.length || 0,
        },
      },
      { status: 500 }
    );
  }
}
