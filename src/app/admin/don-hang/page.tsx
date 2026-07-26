import type { Metadata } from "next";
import Link from "next/link";

import { OrderManagement } from "@/components/admin/order-management";
import type { AdminOrder } from "@/data/admin";
import { OrderStatus } from "@/generated/prisma/enums";
import { formatVnd } from "@/lib/commerce";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Quản lý đơn hàng",
  robots: { index: false, follow: false },
};
const labels: Partial<Record<OrderStatus, AdminOrder["status"]>> = {
  NEW: "Mới",
  CONFIRMED: "Cần gọi lại",
  PREPARING: "Đang chuẩn bị",
  DELIVERED: "Đã giao",
};

export default async function AdminOrdersPage() {
  const db = getDb();
  const records = db
    ? await db.order.findMany({ orderBy: { updatedAt: "desc" }, take: 200 })
    : [];
  const orders: AdminOrder[] = records.map((order) => ({
    id: order.id,
    customer: order.customerName,
    channel: `Website · ${order.paymentMethod.toUpperCase()}`,
    total: formatVnd(order.total),
    status: labels[order.status] ?? "Cần gọi lại",
    updatedAt: new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(order.updatedAt),
  }));
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Admin · Đơn hàng</p>
          <h1>Theo dõi đơn từ lúc tiếp nhận đến khi giao.</h1>
          <p>
            Tìm kiếm, lọc và cập nhật trạng thái đơn hàng trực tiếp trên
            PostgreSQL.
          </p>
        </div>
      </section>
      <div className="container breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <Link href="/admin">Admin</Link>
        <span aria-hidden="true">/</span>
        <span>Đơn hàng</span>
      </div>
      <section className="section-compact container admin-shell">
        <OrderManagement initialOrders={orders} />
      </section>
    </>
  );
}
