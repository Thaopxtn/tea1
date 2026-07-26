import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductExplorer } from "@/components/commerce/product-explorer";
import { products } from "@/data/products";

const collections: Record<string, { title: string; description: string }> = {
  "vu-moi": {
    title: "Trà mùa xuân",
    description:
      "Những lựa chọn trà mùa xuân với hương vị tươi sáng và cách pha dễ theo.",
  },
  "cao-cap": {
    title: "Tuyển chọn cao cấp",
    description: "Những phẩm trà có tiêu chuẩn búp nhỏ và nhịp vị sâu.",
  },
  "qua-bieu": {
    title: "Quà biếu",
    description: "Hộp trà cho tri ân, gia đình và đối tác.",
  },
  "hang-ngay": {
    title: "Trà dùng hằng ngày",
    description: "Dễ pha, cân bằng và phù hợp nhịp uống thường xuyên.",
  },
};

export function generateStaticParams() {
  return Object.keys(collections).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections[slug];
  return collection
    ? {
        title: collection.title,
        description: collection.description,
        alternates: { canonical: `/bo-suu-tap/${slug}` },
      }
    : {};
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collections[slug];
  if (!collection) notFound();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Bộ sưu tập</p>
          <h1>{collection.title}</h1>
          <p>{collection.description}</p>
        </div>
      </section>
      <div className="container breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <span>{collection.title}</span>
      </div>
      <section className="section-compact container">
        <Suspense fallback={<p aria-live="polite">Đang chuẩn bị bộ lọc…</p>}>
          <ProductExplorer items={products} fixedCollection={slug} />
        </Suspense>
      </section>
    </>
  );
}
