export const FREE_SHIPPING_THRESHOLD = 600_000;

export function calculateShippingFee(subtotal: number, province: string) {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  const normalized = province
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (normalized.includes("thai nguyen")) return 20_000;
  if (normalized.includes("ha noi")) return 25_000;
  return 35_000;
}
