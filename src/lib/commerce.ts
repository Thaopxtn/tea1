import type { Product, ProductVariant } from "@/types/product";

export const formatVnd = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export const getLowestPrice = (product: Product) =>
  Math.min(...product.variants.map((variant) => variant.price));

export const getAvailableVariant = (
  product: Product,
): ProductVariant | undefined =>
  product.variants.find((variant) => variant.stock > 0);

export const calculateLineTotal = (price: number, quantity: number) =>
  Math.max(0, price) * Math.max(0, quantity);

export const calculateCartTotal = (
  lines: Array<{ price: number; quantity: number }>,
) =>
  lines.reduce(
    (total, line) => total + calculateLineTotal(line.price, line.quantity),
    0,
  );

export const applyDemoCoupon = (subtotal: number, code: string) => {
  if (code.trim().toUpperCase() !== "MOCSUONG10") return 0;
  return Math.min(Math.round(subtotal * 0.1), 150_000);
};
