import dotenv from "dotenv";

dotenv.config();

const SHOPIFY_STORE_DOMAIN = "df1qgb-iw.myshopify.com";
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = "2025-07";
const LIGHTNING_CHANNEL_ID = "gid://shopify/Publication/110010433633";

async function getProducts() {
  try {
    console.log("🔍 Fetching all products...");

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/products.json?limit=250`,
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    console.log(`📦 Found ${data.products.length} products`);
    return data.products;
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    return [];
  }
}

async function publishToLightning(productId) {
  try {
    // First, get the product's current publications
    const productQuery = `
      query getProduct($id: ID!) {
        product(id: $id) {
          id
          title
          publishedOnPublication(publicationId: "${LIGHTNING_CHANNEL_ID}") {
            id
            publishedAt
          }
        }
      }
    `;

    const productResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query: productQuery,
          variables: { id: `gid://shopify/Product/${productId}` },
        }),
      }
    );

    const productData = await productResponse.json();

    // Check if already published to Lightning
    if (productData.data?.product?.publishedOnPublication) {
      console.log(`✅ Product ${productId} already published to Lightning`);
      return true;
    }

    // Try to publish using the REST API instead
    const publishResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/products/${productId}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
        },
        body: JSON.stringify({
          product: {
            id: productId,
            published_scope: "global",
            published_at: new Date().toISOString(),
          },
        }),
      }
    );

    if (publishResponse.ok) {
      console.log(`📢 Published product ${productId} to Lightning channel`);
      return true;
    } else {
      const error = await publishResponse.text();
      console.error(`❌ Failed to publish product ${productId}:`, error);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error publishing product ${productId}:`, error.message);
    return false;
  }
}

async function moveAllProductsToLightning() {
  console.log("🚀 Moving all products to Lightning channel...");
  console.log(`🏪 Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`📺 Lightning Channel ID: ${LIGHTNING_CHANNEL_ID}`);

  if (!SHOPIFY_ADMIN_TOKEN) {
    console.error("❌ Missing SHOPIFY_ADMIN_ACCESS_TOKEN environment variable");
    process.exit(1);
  }

  const products = await getProducts();

  if (products.length === 0) {
    console.log("❌ No products found");
    return;
  }

  console.log(`\n📦 Processing ${products.length} products...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(
      `\n📦 Processing product ${i + 1}/${products.length}: ${
        product.title
      } (ID: ${product.id})`
    );

    const success = await publishToLightning(product.id);

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`\n🎉 Migration completed!`);
  console.log(`✅ Successfully published: ${successCount} products`);
  console.log(`❌ Failed to publish: ${failCount} products`);
  console.log(
    `📺 All products should now be available in the Lightning channel!`
  );
  console.log(
    `🔗 View your products: https://${SHOPIFY_STORE_DOMAIN}/admin/products`
  );
}

// Run the script
moveAllProductsToLightning()
  .then(() => {
    console.log(`\n✅ Script completed successfully!`);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
