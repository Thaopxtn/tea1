"use client";

import Link from "next/link";

import { ProductCard } from "@/components/commerce/product-card";
import { buttonVariants } from "@/components/ui/button";
import { products } from "@/data/products";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCommerceStore } from "@/store/commerce-store";

export function WishlistPageClient() {
  const hydrated = useHydrated();
  const ids = useCommerceStore((state) => state.wishlist);
  const items = products.filter((product) => ids.includes(product.id));
  if (!hydrated)
    return (
      <div className="empty-state">
        <p>Đang đọc danh sách yêu thích…</p>
      </div>
    );
  if (!items.length) {
    return (
      <div className="empty-state">
        <h2>Chưa có sản phẩm yêu thích</h2>
        <p>Chạm biểu tượng trái tim để lưu trà và quay lại sau.</p>
        <Link
          className={buttonVariants({ intent: "primary", size: "lg" })}
          href="/san-pham"
        >
          Khám phá trà
        </Link>
      </div>
    );
  }
  return (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
