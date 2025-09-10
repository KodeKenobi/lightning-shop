// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const products = [
    {
      slug: "light-tee",
      name: "Lightning Tee",
      description: "Featherweight, fast-drying tee.",
      priceCents: 1999,
      imageUrl:
        "https://images.unsplash.com/photo-1520975918318-7cc47d7ac5d2?auto=format&fit=crop&w=600&q=80",
    },
    {
      slug: "bolt-cap",
      name: "Bolt Cap",
      description: "Minimal, breathable cap.",
      priceCents: 1499,
      imageUrl:
        "https://images.unsplash.com/photo-1602810318383-e6b0c4973e8e?auto=format&fit=crop&w=600&q=80",
    },
    {
      slug: "zap-bottle",
      name: "Zap Bottle",
      description: "Insulated steel bottle.",
      priceCents: 2499,
      imageUrl:
        "https://images.unsplash.com/photo-1617196039897-8d3ff4466f29?auto=format&fit=crop&w=600&q=80",
    },
  ];

  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
    console.log("Seeded ✅");
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
