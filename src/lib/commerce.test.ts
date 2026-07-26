import { describe, expect, it } from "vitest";

import {
  applyDemoCoupon,
  calculateCartTotal,
  calculateLineTotal,
  formatVnd,
  getAvailableVariant,
} from "@/lib/commerce";
import { products } from "@/data/products";

describe("commerce helpers", () => {
  it("định dạng tiền VND theo locale Việt Nam", () => {
    expect(formatVnd(580_000)).toMatch(/580[.\s]000\s?₫/);
  });

  it("chọn biến thể còn hàng đầu tiên", () => {
    const variant = getAvailableVariant(products[0]);
    expect(variant?.stock).toBeGreaterThan(0);
  });

  it("tính tổng dòng và tổng giỏ chính xác", () => {
    expect(calculateLineTotal(120_000, 3)).toBe(360_000);
    expect(
      calculateCartTotal([
        { price: 120_000, quantity: 3 },
        { price: 80_000, quantity: 2 },
      ]),
    ).toBe(520_000);
  });

  it("áp mã demo và giới hạn mức giảm", () => {
    expect(applyDemoCoupon(800_000, "mocsuong10")).toBe(80_000);
    expect(applyDemoCoupon(2_000_000, "MOCSUONG10")).toBe(150_000);
    expect(applyDemoCoupon(800_000, "SAI")).toBe(0);
  });
});
