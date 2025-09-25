import { NextResponse } from "next/server";
import { getProductsFromSanity } from "@/lib/shopifyToSanitySync";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("🔍 Starting product fetch from Sanity...");
    console.log("📡 Sanity Environment variables:");
    console.log("  - Project ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log("  - Dataset:", process.env.NEXT_PUBLIC_SANITY_DATASET);
    console.log("  - Has Token:", !!process.env.SANITY_API_TOKEN);

    const products = await getProductsFromSanity();
    console.log("✅ Products from Sanity:", JSON.stringify(products, null, 2));
    console.log("📊 Number of products:", products.length);

    // Convert Sanity products to the format expected by the frontend
    const formattedProducts = products.map((product) => ({
      id: product.shopifyId,
      slug: product.handle,
      name: product.title,
      description: product.description,
      priceCents: product.price,
      compareAtPriceCents: product.compareAtPrice,
      imageUrl: product.images[0]?.url || "",
      images: product.images.map((img) => img.url),
      availableForSale: product.availableForSale,
      featured: product.featured,
      category: product.category,
      tags: product.tags || [],
    }));

    return NextResponse.json(
      {
        products: formattedProducts,
        debug: {
          environment: {
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
            hasToken: !!process.env.SANITY_API_TOKEN,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching products from Sanity:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
    });
    return NextResponse.json(
      {
        error: "Failed to fetch products from Sanity",
        details: error instanceof Error ? error.message : String(error),
        environment: {
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
          hasToken: !!process.env.SANITY_API_TOKEN,
        },
      },
      { status: 500 }
    );
  }
}
