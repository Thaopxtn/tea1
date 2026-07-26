import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { ProductExplorer } from "@/components/commerce/product-explorer";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Tất cả trà và trà cụ",
  description:
    "Lọc chè Thái Nguyên theo phẩm trà, vùng chè, hương vị, caffeine và tình trạng còn hàng.",
  alternates: { canonical: "/san-pham" },
};

export default function ProductsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">24 lựa chọn trà và trà cụ</p>
          <h1>Chọn trà bằng hương, vị và dịp dùng.</h1>
          <p>
            Lọc theo phẩm trà, vùng nguyên liệu, hương vị và khoảng giá để tìm
            lựa chọn hợp gu, từ trà uống hằng ngày đến hộp quà trang nhã.
          </p>
        </div>
      </section>
      <div className="container breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <span>Sản phẩm</span>
      </div>
      <section className="section-compact container">
        <Suspense fallback={<p aria-live="polite">Đang chuẩn bị bộ lọc…</p>}>
          <ProductExplorer items={products} />
        </Suspense>
      </section>
    </>
  );
}
