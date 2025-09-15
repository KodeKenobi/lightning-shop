import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("🔍 Testing Sanity connection...");
    console.log("Environment variables:");
    console.log("  - Project ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log("  - Dataset:", process.env.NEXT_PUBLIC_SANITY_DATASET);
    console.log("  - API Version:", process.env.NEXT_PUBLIC_SANITY_API_VERSION);
    console.log("  - Has Token:", !!process.env.SANITY_API_TOKEN);

    // Test basic connection
    const query = `*[_type == "hero"][0]`;
    const result = await sanityClient.fetch(query);

    console.log("✅ Sanity connection successful!");
    console.log("Result:", result);

    return NextResponse.json({
      success: true,
      data: result,
      environment: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
        hasToken: !!process.env.SANITY_API_TOKEN,
      },
    });
  } catch (error) {
    console.error("❌ Sanity connection failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        environment: {
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
          apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
          hasToken: !!process.env.SANITY_API_TOKEN,
        },
      },
      { status: 500 }
    );
  }
}
