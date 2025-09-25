import dotenv from "dotenv";

dotenv.config();

const SHOPIFY_STORE_DOMAIN = "df1qgb-iw.myshopify.com";
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = "2025-07";

async function checkChannels() {
  try {
    const query = `
      query getPublications {
        publications(first: 50) {
          edges {
            node {
              id
              name
              supportsFuturePublishing
            }
          }
        }
      }
    `;

    console.log("🔍 Checking available sales channels...");

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();
    console.log("📊 Available channels:");
    console.log(JSON.stringify(data, null, 2));

    if (data.data?.publications?.edges) {
      const channels = data.data.publications.edges.map((edge) => ({
        id: edge.node.id,
        name: edge.node.name,
        supportsFuturePublishing: edge.node.supportsFuturePublishing,
      }));

      console.log("\n📺 Available Sales Channels:");
      channels.forEach((channel) => {
        console.log(`  - ${channel.name} (ID: ${channel.id})`);
        console.log(
          `    Supports Future Publishing: ${channel.supportsFuturePublishing}`
        );
      });

      // Look for Lightning channel
      const lightningChannel = channels.find((ch) =>
        ch.name.toLowerCase().includes("lightning")
      );

      if (lightningChannel) {
        console.log(`\n⚡ Found Lightning channel: ${lightningChannel.name}`);
        console.log(`   ID: ${lightningChannel.id}`);
      } else {
        console.log("\n❌ No Lightning channel found");
        console.log(
          "Available channels:",
          channels.map((c) => c.name).join(", ")
        );
      }
    }
  } catch (error) {
    console.error("❌ Error checking channels:", error.message);
  }
}

checkChannels();
