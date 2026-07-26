"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/commerce/product-card";
import { products } from "@/data/products";

const tabs = [
  { id: "best", label: "Dễ bắt đầu" },
  { id: "new", label: "Mùa xuân" },
  { id: "premium", label: "Cao cấp" },
  { id: "gift", label: "Quà biếu" },
] as const;

export function FeaturedProducts() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("best");
  const selected = useMemo(() => {
    const filtered = products.filter((product) => {
      if (active === "new") return product.collection === "vu-moi";
      if (active === "premium") return product.collection === "cao-cap";
      if (active === "gift") return product.collection === "qua-bieu";
      return product.badges.includes("Dễ bắt đầu") || product.featured;
    });
    return filtered.slice(0, 4);
  }, [active]);

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Nhóm trà nổi bật">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div key={active} className="product-grid featured-grid" role="tabpanel">
        {selected.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
