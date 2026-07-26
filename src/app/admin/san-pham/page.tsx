import type { Metadata } from "next";
import Link from "next/link";

import {
  ProductManagement,
  type AdminProductRow,
} from "@/components/admin/product-management";
import { ProductStatus } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const db = getDb();
  const products = db
    ? await db.product.findMany({
        include: { variants: true },
        orderBy: { updatedAt: "desc" },
      })
    : [];
  const rows: AdminProductRow[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    region: product.region,
    price: product.variants.length
      ? Math.min(...product.variants.map((item) => item.price))
      : 0,
    stock: product.variants.reduce((sum, item) => sum + item.stock, 0),
    active: product.status === ProductStatus.ACTIVE,
  }));

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Admin · Sản phẩm</p>
          <h1>Quản lý danh mục, giá và tồn kho.</h1>
          <p>
            Dữ liệu được đọc trực tiếp từ PostgreSQL và mọi thay đổi đều được
            xác thực trên máy chủ.
          </p>
        </div>
      </section>
      <div className="container breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <Link href="/admin">Admin</Link>
        <span aria-hidden="true">/</span>
        <span>Sản phẩm</span>
      </div>
      <section className="section-compact container admin-shell">
        <ProductManagement initialProducts={rows} />
      </section>
    </>
  );
}
