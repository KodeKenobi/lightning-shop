import { NextResponse } from "next/server";
import { syncProductsFromShopify } from "@/lib/shopifyToSanitySync";

export const runtime = "nodejs";

export async function POST() {
  try {
    console.log("🔄 Starting manual product sync...");

    const result = await syncProductsFromShopify();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully synced ${result.synced} products`,
        synced: result.synced,
        errors: result.errors,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: `Sync completed with errors. Synced: ${result.synced}, Errors: ${result.errors.length}`,
          synced: result.synced,
          errors: result.errors,
        },
        { status: 207 }
      ); // 207 Multi-Status for partial success
    }
  } catch (error) {
    console.error("❌ Sync API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to sync products",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to trigger product sync",
    endpoint: "/api/sync-products",
    method: "POST",
  });
}
