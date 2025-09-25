import { NextResponse } from "next/server";
import { syncProductsFromShopify } from "@/lib/shopifyToSanitySync";
import crypto from "crypto";

export const runtime = "nodejs";

// Verify Shopify webhook signature
function verifyShopifyWebhook(
  body: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body, "utf8");
  const hash = hmac.digest("base64");
  return hash === signature;
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-shopify-hmac-sha256");
    const topic = request.headers.get("x-shopify-topic");

    console.log(`🔔 Received Shopify webhook: ${topic}`);

    // Verify webhook signature
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("❌ SHOPIFY_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    if (!signature || !verifyShopifyWebhook(body, signature, webhookSecret)) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Handle different webhook topics
    switch (topic) {
      case "products/create":
      case "products/update":
      case "products/delete":
        console.log(`🔄 Product ${topic} detected, syncing...`);
        const result = await syncProductsFromShopify();

        if (result.success) {
          console.log(`✅ Sync completed: ${result.synced} products synced`);
          return NextResponse.json({
            success: true,
            message: `Synced ${result.synced} products`,
            synced: result.synced,
          });
        } else {
          console.error(`❌ Sync failed: ${result.errors.join(", ")}`);
          return NextResponse.json(
            {
              success: false,
              message: "Sync failed",
              errors: result.errors,
            },
            { status: 500 }
          );
        }

      default:
        console.log(`ℹ️ Unhandled webhook topic: ${topic}`);
        return NextResponse.json({
          message: "Webhook received but not processed",
        });
    }
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({
    message: "Shopify webhook endpoint is active",
    endpoint: "/api/webhooks/shopify",
    methods: ["POST"],
  });
}
