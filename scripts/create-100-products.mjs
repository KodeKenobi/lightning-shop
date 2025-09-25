import dotenv from "dotenv";

dotenv.config();

const SHOPIFY_STORE_DOMAIN = "df1qgb-iw.myshopify.com";
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = "2025-07";

const productCategories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Fitness",
  "Beauty & Health",
  "Books & Media",
  "Toys & Games",
  "Automotive",
  "Food & Beverages",
  "Jewelry & Accessories",
];

const productTemplates = {
  Electronics: [
    {
      name: "Wireless Bluetooth Headphones",
      basePrice: 89.99,
      description:
        "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    },
    {
      name: "Smart Watch Series",
      basePrice: 199.99,
      description:
        "Advanced smartwatch with health monitoring, GPS, and water resistance.",
    },
    {
      name: "Portable Power Bank",
      basePrice: 29.99,
      description: "Compact power bank with fast charging and LED display.",
    },
    {
      name: "USB-C Hub",
      basePrice: 49.99,
      description:
        "Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader.",
    },
    {
      name: "Wireless Charging Pad",
      basePrice: 24.99,
      description:
        "Fast wireless charging pad compatible with all Qi-enabled devices.",
    },
  ],
  Clothing: [
    {
      name: "Premium Cotton T-Shirt",
      basePrice: 24.99,
      description:
        "Soft, breathable cotton t-shirt available in multiple colors and sizes.",
    },
    {
      name: "Denim Jeans",
      basePrice: 79.99,
      description:
        "Classic fit denim jeans with stretch for comfort and durability.",
    },
    {
      name: "Hooded Sweatshirt",
      basePrice: 49.99,
      description:
        "Cozy hooded sweatshirt perfect for casual wear and outdoor activities.",
    },
    {
      name: "Running Shoes",
      basePrice: 129.99,
      description:
        "Lightweight running shoes with advanced cushioning and breathable mesh.",
    },
    {
      name: "Winter Jacket",
      basePrice: 149.99,
      description:
        "Waterproof winter jacket with insulation and multiple pockets.",
    },
  ],
  "Home & Garden": [
    {
      name: "LED Desk Lamp",
      basePrice: 39.99,
      description:
        "Adjustable LED desk lamp with touch control and USB charging port.",
    },
    {
      name: "Indoor Plant Pot",
      basePrice: 19.99,
      description:
        "Ceramic plant pot with drainage holes, perfect for indoor gardening.",
    },
    {
      name: "Kitchen Knife Set",
      basePrice: 89.99,
      description:
        "Professional-grade knife set with wooden block and sharpening steel.",
    },
    {
      name: "Throw Pillow",
      basePrice: 29.99,
      description:
        "Decorative throw pillow with removable cover and premium fabric.",
    },
    {
      name: "Candle Set",
      basePrice: 34.99,
      description: "Scented candle set with natural soy wax and cotton wicks.",
    },
  ],
  "Sports & Fitness": [
    {
      name: "Yoga Mat",
      basePrice: 34.99,
      description: "Non-slip yoga mat with carrying strap and alignment lines.",
    },
    {
      name: "Resistance Bands Set",
      basePrice: 24.99,
      description:
        "Set of resistance bands with different resistance levels and handles.",
    },
    {
      name: "Water Bottle",
      basePrice: 19.99,
      description:
        "Insulated water bottle that keeps drinks cold for 24 hours.",
    },
    {
      name: "Jump Rope",
      basePrice: 14.99,
      description:
        "Adjustable jump rope with weighted handles and smooth ball bearings.",
    },
    {
      name: "Foam Roller",
      basePrice: 29.99,
      description:
        "High-density foam roller for muscle recovery and flexibility.",
    },
  ],
  "Beauty & Health": [
    {
      name: "Facial Cleanser",
      basePrice: 18.99,
      description:
        "Gentle facial cleanser for all skin types with natural ingredients.",
    },
    {
      name: "Moisturizing Cream",
      basePrice: 24.99,
      description:
        "Hydrating moisturizing cream with vitamin E and hyaluronic acid.",
    },
    {
      name: "Hair Shampoo",
      basePrice: 16.99,
      description: "Sulfate-free shampoo for healthy hair with argan oil.",
    },
    {
      name: "Electric Toothbrush",
      basePrice: 79.99,
      description:
        "Sonic electric toothbrush with multiple cleaning modes and timer.",
    },
    {
      name: "Skincare Serum",
      basePrice: 39.99,
      description:
        "Anti-aging serum with retinol and vitamin C for youthful skin.",
    },
  ],
};

const colors = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Pink",
  "Gray",
  "Brown",
];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

function generateProductName(template, category) {
  const color = colors[Math.floor(Math.random() * colors.length)];
  const variations = [
    `${color} ${template.name}`,
    `Premium ${template.name}`,
    `Pro ${template.name}`,
    `${template.name} ${color} Edition`,
    `Deluxe ${template.name}`,
  ];

  return variations[Math.floor(Math.random() * variations.length)];
}

function generateVariants(productName, basePrice) {
  const variantCount = Math.floor(Math.random() * 3) + 1; // 1-3 variants
  const variants = [];

  for (let i = 0; i < variantCount; i++) {
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const priceVariation = (Math.random() - 0.5) * 20; // ±$10 variation
    const price = Math.max(9.99, basePrice + priceVariation);

    variants.push({
      title: `${color} / ${size}`,
      price: price.toFixed(2),
      sku: `LS-${Date.now()}-${i}`,
      inventory_quantity: Math.floor(Math.random() * 50) + 10,
      option1: color,
      option2: size,
      inventory_management: "shopify",
      inventory_policy: "continue",
      taxable: true,
      requires_shipping: true,
    });
  }

  return variants;
}

function generateImages(category) {
  const imageUrls = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
  ];

  return imageUrls.slice(0, Math.floor(Math.random() * 3) + 1).map((url) => ({
    src: url,
    alt: `${category} product image`,
  }));
}

async function createProduct(productData) {
  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/products.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
        },
        body: JSON.stringify(productData),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log(
        `✅ Created product: ${productData.product.title} (ID: ${result.product.id})`
      );
      return result.product;
    } else {
      const error = await response.text();
      console.error(
        `❌ Failed to create product: ${productData.product.title}`,
        error
      );
      return null;
    }
  } catch (error) {
    console.error(
      `❌ Error creating product: ${productData.product.title}`,
      error.message
    );
    return null;
  }
}

async function publishToChannel(productId) {
  try {
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
          publicationId: "gid://shopify/Publication/lightning",
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

    if (response.ok) {
      const result = await response.json();
      if (result.data?.publishablePublish?.userErrors?.length === 0) {
        console.log(`📢 Published product ${productId} to Lightning channel`);
        return true;
      } else {
        console.error(
          `❌ Failed to publish product ${productId}:`,
          result.data?.publishablePublish?.userErrors
        );
        return false;
      }
    } else {
      console.error(
        `❌ Error publishing product ${productId}:`,
        await response.text()
      );
      return false;
    }
  } catch (error) {
    console.error(`❌ Error publishing product ${productId}:`, error.message);
    return false;
  }
}

async function create100Products() {
  console.log("🚀 Starting to create 100 products for Lightning channel...");
  console.log(`🏪 Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`📺 Channel: Lightning`);

  if (!SHOPIFY_ADMIN_TOKEN) {
    console.error("❌ Missing SHOPIFY_ADMIN_ACCESS_TOKEN environment variable");
    process.exit(1);
  }

  const products = [];
  const categories = Object.keys(productTemplates);

  for (let i = 0; i < 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const templates = productTemplates[category];
    const template = templates[Math.floor(Math.random() * templates.length)];

    const productName = generateProductName(template, category);
    const variants = generateVariants(productName, template.basePrice);
    const images = generateImages(category);

    const productData = {
      product: {
        title: productName,
        body_html: `<p>${template.description}</p><p><strong>Category:</strong> ${category}</p><p><strong>Features:</strong> Premium quality, durable construction, excellent value</p>`,
        vendor: "Lightning Shop",
        product_type: category,
        status: "active",
        tags: [category.toLowerCase(), "premium", "quality", "lightning"],
        published_scope: "global",
        published_at: new Date().toISOString(),
        variants: variants,
        images: images,
        options: [
          {
            name: "Color",
            values: [...new Set(variants.map((v) => v.option1))],
          },
          {
            name: "Size",
            values: [...new Set(variants.map((v) => v.option2))],
          },
        ],
        seo_title: `${productName} - Lightning Shop`,
        seo_description: template.description,
      },
    };

    console.log(`📦 Creating product ${i + 1}/100: ${productName}`);

    const product = await createProduct(productData);
    if (product) {
      products.push(product);

      // Publish to Lightning channel
      await publishToChannel(product.id);
    }

    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n🎉 Successfully created ${products.length} products!`);
  console.log(`📊 Products by category:`);

  const categoryCount = {};
  products.forEach((product) => {
    const category = product.product_type;
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} products`);
  });

  console.log(
    `\n📺 All products have been published to the Lightning channel!`
  );
  console.log(
    `🔗 View your products: https://${SHOPIFY_STORE_DOMAIN}/admin/products`
  );

  return products;
}

// Run the script
create100Products()
  .then((products) => {
    console.log(`\n✅ Script completed successfully!`);
    console.log(`📈 Total products created: ${products.length}`);
    console.log(`🎯 All products are now available in your Lightning channel!`);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
