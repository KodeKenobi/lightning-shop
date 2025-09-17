import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const productData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      productType: formData.get("productType") as string,
      vendor: formData.get("vendor") as string,
      tags: JSON.parse((formData.get("tags") as string) || "[]"),
      price: formData.get("price") as string,
      compareAtPrice: formData.get("compareAtPrice") as string,
      costPerItem: formData.get("costPerItem") as string,
      sku: formData.get("sku") as string,
      barcode: formData.get("barcode") as string,
      trackQuantity: formData.get("trackQuantity") === "true",
      quantity: formData.get("quantity") as string,
      continueSelling: formData.get("continueSelling") === "true",
      physicalProduct: formData.get("physicalProduct") === "true",
      weight: formData.get("weight") as string,
      weightUnit: formData.get("weightUnit") as string,
      seoTitle: formData.get("seoTitle") as string,
      seoDescription: formData.get("seoDescription") as string,
      status: formData.get("status") as string,
    };

    const images = [];
    let index = 0;
    while (formData.has(`image_${index}`)) {
      images.push(formData.get(`image_${index}`));
      index++;
    }

    // Store images for later upload after product creation
    const imagesToUpload = [...images];

    const shopifyProduct = {
      product: {
        title: productData.title,
        body_html: productData.description,
        vendor: productData.vendor,
        product_type: productData.productType,
        status: productData.status.toLowerCase(),
        tags: productData.tags.join(", "),
        published_scope: "global",
        published_at:
          productData.status.toLowerCase() === "active"
            ? new Date().toISOString()
            : null,
        variants: [
          {
            price: productData.price,
            compare_at_price: productData.compareAtPrice || undefined,
            sku: productData.sku || undefined,
            barcode: productData.barcode || undefined,
            inventory_quantity: productData.trackQuantity
              ? parseInt(productData.quantity) || 0
              : undefined,
            inventory_management: productData.trackQuantity ? "shopify" : null,
            inventory_policy: productData.continueSelling ? "continue" : "deny",
            weight: productData.physicalProduct
              ? parseFloat(productData.weight)
              : undefined,
            weight_unit: productData.physicalProduct
              ? productData.weightUnit
              : undefined,
            requires_shipping: productData.physicalProduct,
            taxable: true,
          },
        ],
        seo_title: productData.seoTitle || undefined,
        seo_description: productData.seoDescription || undefined,
      },
    };

    console.log("Creating product with data:", shopifyProduct);
    console.log(
      "Payload being sent to Shopify:",
      JSON.stringify(shopifyProduct, null, 2)
    );

    const response = await fetch(
      `https://df1qgb-iw.myshopify.com/admin/api/2025-07/products.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
        },
        body: JSON.stringify(shopifyProduct),
      }
    );

    const result: {
      product?: { id: string | number; [key: string]: unknown };
      errors?: unknown[];
    } = await response.json();

    console.log("Shopify API response:", result);

    if (!response.ok) {
      console.error("Shopify API error:", result);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create product",
          errors: result.errors || [result],
        },
        { status: 400 }
      );
    }

    // After successful product creation, publish to Lightning channel
    if (result.product?.id) {
      try {
        console.log("Publishing product to Lightning channel...");
        const publishResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/api/admin/products/publish-to-channel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: result.product.id, // Use the original GraphQL ID for the API call
              channelName: "Lightning",
            }),
          }
        );

        const publishResult = await publishResponse.json();
        console.log("Lightning channel publish result:", publishResult);

        if (publishResult.success) {
          console.log("✅ Product successfully published to Lightning channel");
        } else {
          console.warn(
            "⚠️ Failed to publish to Lightning channel:",
            publishResult.message
          );
        }
      } catch (publishError) {
        console.error("Error publishing to Lightning channel:", publishError);
        // Don't fail the entire request if Lightning publishing fails
      }
    }

    // Upload images to the created product
    if (imagesToUpload.length > 0 && result.product) {
      console.log(
        `Uploading ${imagesToUpload.length} images to product ${result.product.id}...`
      );

      for (const imageFile of imagesToUpload) {
        if (!imageFile || !(imageFile instanceof File)) {
          console.warn("Skipping invalid image file:", imageFile);
          continue;
        }

        try {
          // Convert file to base64
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              // Remove data:image/jpeg;base64, prefix
              const base64Data = result.split(",")[1];
              resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
          });

          // Upload image to the specific product
          const imageUploadResponse = await fetch(
            `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/products/${result.product.id}/images.json`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token":
                  process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
              },
              body: JSON.stringify({
                image: {
                  attachment: base64,
                  filename: imageFile.name,
                },
              }),
            }
          );

          if (imageUploadResponse.ok) {
            const imageResult = await imageUploadResponse.json();
            console.log(
              `✅ Uploaded image: ${imageFile.name} - ${imageResult.image.src}`
            );
          } else {
            const errorResult = await imageUploadResponse.json();
            console.error(
              `❌ Failed to upload image: ${imageFile.name}`,
              errorResult
            );
          }
        } catch (error) {
          console.error(`❌ Error uploading image ${imageFile.name}:`, error);
        }
      }
    }

    // Convert GraphQL ID to numeric ID for consistency
    if (!result.product) {
      return NextResponse.json(
        {
          success: false,
          message: "No product returned from Shopify",
        },
        { status: 400 }
      );
    }

    const productWithNumericId = {
      ...result.product,
      id:
        typeof result.product.id === "string"
          ? result.product.id.split("/").pop() || result.product.id
          : result.product.id,
    };

    return NextResponse.json(
      {
        success: true,
        product: productWithNumericId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
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
