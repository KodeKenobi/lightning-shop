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

async function publishToLightningChannel(productId) {
  try {
    // Use the publishablePublish mutation with the correct publication ID
    const mutation = `
      mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          publishable {
            ... on Product {
              id
              title
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      id: `gid://shopify/Product/${productId}`,
      input: [
        {
          publicationId: LIGHTNING_CHANNEL_ID,
        },
      ],
    };

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query: mutation,
          variables: variables,
        }),
      }
    );

    const result = await response.json();

    if (result.data?.publishablePublish?.userErrors?.length === 0) {
      console.log(`✅ Published product ${productId} to Lightning channel`);
      return true;
    } else {
      console.error(
        `❌ Failed to publish product ${productId}:`,
        result.data?.publishablePublish?.userErrors
      );
      return false;
    }
  } catch (error) {
    console.error(`❌ Error publishing product ${productId}:`, error.message);
    return false;
  }
}

async function publishAllToLightning() {
  console.log("🚀 Publishing all products to Lightning channel...");
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

    const success = await publishToLightningChannel(product.id);

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n🎉 Publishing completed!`);
  console.log(`✅ Successfully published: ${successCount} products`);
  console.log(`❌ Failed to publish: ${failCount} products`);
  console.log(`📺 Products should now be available in the Lightning channel!`);
  console.log(
    `🔗 View your products: https://${SHOPIFY_STORE_DOMAIN}/admin/products`
  );
}

// Run the script
publishAllToLightning()
  .then(() => {
    console.log(`\n✅ Script completed successfully!`);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
