import type { Metadata } from "next";

import { SearchPageClient } from "@/components/commerce/search-page-client";

export const metadata: Metadata = {
  title: "Tìm kiếm",
  description:
    "Tìm chè Thái Nguyên theo tên, SKU, vùng chè và ghi chú hương vị.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Tìm kiếm</p>
          <h1>Tìm bằng điều bạn nhớ.</h1>
          <p>
            Tên trà, vùng chè, mùi hương, danh mục hoặc mã sản phẩm đều được.
          </p>
        </div>
      </section>
      <section className="section-compact container">
        <SearchPageClient initialQuery={q ?? ""} />
      </section>
    </>
  );
}
