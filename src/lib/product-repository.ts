import { products } from "@/data/products";
import type { Product } from "@/types/product";

export type ProductFilters = {
  query?: string;
  categories?: string[];
  regions?: string[];
  caffeine?: string[];
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const matchesQuery = (value: string, query: string) => {
  const haystack = normalize(value);
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
};

export const productRepository = {
  list: async (): Promise<Product[]> => products,
  getBySlug: async (slug: string): Promise<Product | undefined> =>
    products.find((product) => product.slug === slug),
  related: async (product: Product): Promise<Product[]> =>
    products.filter((item) => product.relatedProductIds.includes(item.id)),
  search: async (query: string): Promise<Product[]> => {
    if (!query.trim()) return [];
    return products.filter((product) =>
      matchesQuery(
        [
          product.name,
          product.sku,
          product.category,
          product.region,
          ...product.aroma,
          ...product.taste,
        ].join(" "),
        query,
      ),
    );
  },
  filter: async (filters: ProductFilters): Promise<Product[]> => {
    const query = filters.query?.trim() ?? "";
    return products.filter((product) => {
      const lowestPrice = Math.min(
        ...product.variants.map((variant) => variant.price),
      );
      return (
        (!query ||
          matchesQuery(
            [
              product.name,
              product.region,
              product.category,
              ...product.aroma,
            ].join(" "),
            query,
          )) &&
        (!filters.categories?.length ||
          filters.categories.includes(product.category)) &&
        (!filters.regions?.length ||
          filters.regions.includes(product.region)) &&
        (!filters.caffeine?.length ||
          filters.caffeine.includes(product.caffeineLevel)) &&
        (!filters.inStock || product.stockStatus !== "out-of-stock") &&
        (filters.minPrice === undefined || lowestPrice >= filters.minPrice) &&
        (filters.maxPrice === undefined || lowestPrice <= filters.maxPrice)
      );
    });
  },
};
