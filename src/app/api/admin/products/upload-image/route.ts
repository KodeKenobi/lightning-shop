import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;

    if (!file || !productId) {
      return NextResponse.json(
        { success: false, message: "File and productId are required" },
        { status: 400 }
      );
    }

    console.log(
      `Uploading image: ${file.name} (${file.size} bytes) for product ${productId}`
    );

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    console.log(`Base64 length: ${base64.length} characters`);

    // Upload image to Shopify
    const imageData = {
      image: {
        attachment: base64,
        filename: file.name,
      },
    };

    console.log(
      `Uploading to: https://df1qgb-iw.myshopify.com/admin/api/2025-07/products/${productId}/images.json`
    );

    const response = await fetch(
      `https://df1qgb-iw.myshopify.com/admin/api/2025-07/products/${productId}/images.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
        },
        body: JSON.stringify(imageData),
      }
    );

    console.log(`Response status: ${response.status}`);
    const result = await response.json();
    console.log(`Response data:`, result);

    if (!response.ok) {
      console.error("Shopify image upload error:", result);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload image",
          error: result,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      image: result.image,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
