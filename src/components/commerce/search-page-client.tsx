"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/commerce/product-card";
import { products } from "@/data/products";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function SearchPageClient({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return [];
    return products.filter((product) =>
      normalize(
        [
          product.name,
          product.region,
          product.sku,
          product.category,
          ...product.aroma,
          ...product.taste,
        ].join(" "),
      ).includes(needle),
    );
  }, [query]);

  return (
    <div>
      <label className="search-field search-page-field">
        <Search aria-hidden="true" />
        <span className="sr-only">Tìm sản phẩm</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tên trà, vùng chè, hương vị hoặc SKU"
        />
      </label>
      <p className="search-count" aria-live="polite">
        {query
          ? `${results.length} kết quả cho “${query}”`
          : "Nhập từ khóa để bắt đầu."}
      </p>
      {query && results.length ? (
        <div className="product-grid">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="empty-state">
          <h2>Không tìm thấy kết quả</h2>
          <p>Thử “Trà Nõn Tôm”, “Tân Cương”, “cốm” hoặc mã MS-001.</p>
        </div>
      ) : (
        <div className="suggested-searches">
          <p className="eyebrow">Gợi ý</p>
          {["Trà Nõn Tôm", "Tân Cương", "Hộp quà", "Trà cụ"].map((term) => (
            <button key={term} type="button" onClick={() => setQuery(term)}>
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
