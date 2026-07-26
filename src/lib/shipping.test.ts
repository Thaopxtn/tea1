import { describe, expect, it } from "vitest";

import { calculateShippingFee } from "@/lib/shipping";

describe("calculateShippingFee", () => {
  it("miễn phí từ ngưỡng 600.000đ", () => {
    expect(calculateShippingFee(600_000, "Đà Nẵng")).toBe(0);
  });

  it("áp dụng phí theo khu vực", () => {
    expect(calculateShippingFee(200_000, "Thái Nguyên")).toBe(20_000);
    expect(calculateShippingFee(200_000, "Hà Nội")).toBe(25_000);
    expect(calculateShippingFee(200_000, "Đà Nẵng")).toBe(35_000);
  });
});
