import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient, ProductStatus } from "../src/generated/prisma/client";
import { products } from "../src/data/products";

const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  throw new Error("DATABASE_URL is required to seed PostgreSQL.");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        description: product.description,
        category: product.category,
        region: product.region,
        grade: product.grade,
        featured: product.featured,
        status: ProductStatus.ACTIVE,
        images: product.images,
        metadata: {
          shortDescription: product.shortDescription,
          harvestSeason: product.harvestSeason,
          stockStatus: product.stockStatus,
          badges: product.badges,
        },
      },
      create: {
        id: product.id,
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        description: product.description,
        category: product.category,
        region: product.region,
        grade: product.grade,
        featured: product.featured,
        status: ProductStatus.ACTIVE,
        images: product.images,
        metadata: {
          shortDescription: product.shortDescription,
          harvestSeason: product.harvestSeason,
          stockStatus: product.stockStatus,
          badges: product.badges,
        },
      },
    });

    for (const variant of product.variants) {
      await prisma.productVariant.upsert({
        where: { id: variant.id },
        update: {
          label: variant.label,
          weightGrams: variant.weightGrams,
          packaging: variant.packaging,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          stock: variant.stock,
        },
        create: {
          id: variant.id,
          productId: product.id,
          label: variant.label,
          weightGrams: variant.weightGrams,
          packaging: variant.packaging,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          stock: variant.stock,
        },
      });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
