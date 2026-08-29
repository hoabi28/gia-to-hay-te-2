import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { laptops } from "../src/data/laptops";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  console.log(`Seeding ${laptops.length} laptops...`);

  for (const laptop of laptops) {
    await db.laptop.upsert({
      where: { id: laptop.id },
      update: {},
      create: {
        id: laptop.id,
        name: laptop.name,
        brand: laptop.brand,
        series: laptop.series,
        category: laptop.category,
        useCases: laptop.useCases,
        image: laptop.image,
        releaseYear: laptop.releaseYear,
        specs: JSON.parse(JSON.stringify(laptop.specs)),
        performance: JSON.parse(JSON.stringify(laptop.performance)),
        criteria: JSON.parse(JSON.stringify(laptop.criteria)),
        warrantyMonths: laptop.warrantyMonths,
        pros: laptop.pros,
        cons: laptop.cons,
        buyIf: laptop.buyIf,
        avoidIf: laptop.avoidIf,
        bestFor: laptop.bestFor,
        tags: laptop.tags,
        stores: {
          create: laptop.stores.map((s) => ({
            store: s.store,
            price: s.price,
            shippingFee: s.shippingFee,
            gift: s.gift,
            warrantyMonths: s.warrantyMonths,
            inStock: s.inStock,
            url: s.url,
          })),
        },
        priceSnapshots: {
          create: laptop.priceHistory.map((p) => ({
            price: p.price,
            date: new Date(p.date),
          })),
        },
        reviews: {
          create: laptop.reviews.map((r) => ({
            aspect: r.aspect,
            author: r.author,
            date: new Date(r.date),
            rating: r.rating,
            content: r.content,
            helpfulCount: r.helpfulCount,
            usageDurationMonths: r.usageDurationMonths,
          })),
        },
      },
    });
    console.log(`  ✓ ${laptop.name}`);
  }

  console.log("Seed done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
