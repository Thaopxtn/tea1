import { describe, expect, it } from "vitest";

import { productRepository } from "@/lib/product-repository";

describe("product repository", () => {
  it("tìm không dấu theo tên và vùng chè", async () => {
    const byName = await productRepository.search("tom non");
    const byCanonicalName = await productRepository.search("non tom");
    const byRegion = await productRepository.search("tan cuong");
    expect(byName.some((product) => product.name.includes("Trà Nõn Tôm"))).toBe(
      true,
    );
    expect(
      byCanonicalName.some((product) => product.name.includes("Trà Nõn Tôm")),
    ).toBe(true);
    expect(
      byRegion.every((product) =>
        [
          product.name,
          product.region,
          product.category,
          ...product.aroma,
          ...product.taste,
        ]
          .join(" ")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes("tan cuong"),
      ),
    ).toBe(true);
  });

  it("lọc theo danh mục, vùng và tồn kho", async () => {
    const result = await productRepository.filter({
      categories: ["non-tom"],
      regions: ["Tân Cương"],
      inStock: true,
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((product) => product.category === "non-tom")).toBe(
      true,
    );
    expect(result.every((product) => product.region === "Tân Cương")).toBe(
      true,
    );
  });
});
