import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductExplorer } from "@/components/commerce/product-explorer";
import { categories, products } from "@/data/products";

const aliases: Record<string, string[]> = {
  "tra-dinh": ["tra-dinh", "tra-dinh-ngoc"],
  "non-tom": ["non-tom"],
  "moc-cau": ["moc-cau"],
  "tra-bup": ["tra-bup"],
  "hop-qua": ["hop-qua"],
  "tra-cu": ["tra-cu"],
};

export function generateStaticParams() {
  return categories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.description} Khám phá hồ sơ trà, giá và cách pha tại Trà Mộc Sương.`,
    alternates: { canonical: `/danh-muc/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const accepted = aliases[slug] ?? [slug];
  const items = products.filter((product) =>
    accepted.includes(product.category),
  );

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Danh mục · {items.length} sản phẩm</p>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
      </section>
      <div className="container breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <Link href="/san-pham">Sản phẩm</Link>
        <span aria-hidden="true">/</span>
        <span>{category.name}</span>
      </div>
      <section className="section-compact container">
        <Suspense fallback={<p aria-live="polite">Đang chuẩn bị bộ lọc…</p>}>
          <ProductExplorer items={items} />
        </Suspense>
      </section>
    </>
  );
}
