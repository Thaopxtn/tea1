import type { Metadata } from "next";
import Link from "next/link";

import { UserManagement } from "@/components/admin/user-management";
import type { AdminUser } from "@/data/admin";
import { UserStatus } from "@/generated/prisma/enums";
import { formatVnd } from "@/lib/commerce";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Quản lý người dùng",
  description: "Quản lý khách hàng, đại lý và tài khoản nội bộ.",
  robots: { index: false, follow: false },
};
const statusLabels: Record<UserStatus, AdminUser["status"]> = {
  ACTIVE: "Hoạt động",
  PENDING_VERIFICATION: "Cần xác minh",
  SUSPENDED: "Tạm khóa",
};

export default async function AdminUsersPage() {
  const db = getDb();
  const records = db
    ? await db.user.findMany({
        include: { orders: { select: { total: true } } },
        orderBy: { updatedAt: "desc" },
        take: 200,
      })
    : [];
  const users: AdminUser[] = records.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    segment: user.segment as AdminUser["segment"],
    orders: user.orders.length,
    totalSpend: formatVnd(
      user.orders.reduce((sum, order) => sum + order.total, 0),
    ),
    lastSeen: new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(
      user.updatedAt,
    ),
    status: statusLabels[user.status],
  }));
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Admin · Người dùng</p>
          <h1>Quản lý khách hàng và tài khoản nội bộ.</h1>
          <p>
            Theo dõi phân nhóm, trạng thái xác minh và lịch sử mua từ dữ liệu đã
            lưu.
          </p>
        </div>
      </section>
      <div className="container breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <Link href="/admin">Admin</Link>
        <span aria-hidden="true">/</span>
        <span>Người dùng</span>
      </div>
      <section className="section-compact container admin-shell">
        <UserManagement initialUsers={users} />
      </section>
    </>
  );
}
