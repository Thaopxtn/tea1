import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList,
  PackageCheck,
  ShieldCheck,
  UsersRound,
  FileText,
} from "lucide-react";

import { PaymentStatus } from "@/generated/prisma/enums";
import { formatVnd } from "@/lib/commerce";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin",
  description: "Bảng quản trị đơn hàng, tồn kho và khách hàng Mộc Sương.",
  robots: { index: false, follow: false },
};

const quickLinks = [
  {
    href: "/admin/nguoi-dung",
    label: "Người dùng",
    description: "Xem phân nhóm, trạng thái xác minh và lịch sử mua.",
    icon: UsersRound,
  },
  {
    href: "/admin/san-pham",
    label: "Sản phẩm",
    description: "Cập nhật danh mục, trạng thái và tồn kho.",
    icon: PackageCheck,
  },
  {
    href: "/admin/don-hang",
    label: "Đơn hàng",
    description: "Lọc và cập nhật tiến độ xử lý đơn.",
    icon: ClipboardList,
  },
  {
    href: "/admin/blog",
    label: "Blog & SEO",
    description: "Quản lý bài viết và tối ưu hóa tìm kiếm.",
    icon: FileText,
  },
];

export default async function AdminPage() {
  const db = getDb();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const [orders, users, lowStock] = db
    ? await Promise.all([
        db.order.findMany({
          where: { createdAt: { gte: start } },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
        db.user.count({ where: { createdAt: { gte: start } } }),
        db.productVariant.count({ where: { stock: { lte: 5 } } }),
      ])
    : [[], 0, 0];
  const revenue = orders
    .filter((item) => item.paymentStatus === PaymentStatus.PAID)
    .reduce((sum, item) => sum + item.total, 0);
  const metrics = [
    {
      label: "Doanh thu hôm nay",
      value: formatVnd(revenue),
      delta: "Đơn đã thanh toán",
    },
    {
      label: "Đơn hôm nay",
      value: String(orders.length),
      delta: "Được tạo trên website",
    },
    {
      label: "Sản phẩm sắp hết",
      value: String(lowStock),
      delta: "Tồn kho từ 5 trở xuống",
    },
    { label: "Khách mới", value: String(users), delta: "Tạo trong hôm nay" },
  ];

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container admin-hero-grid">
          <div>
            <p className="eyebrow">Khu vực quản trị</p>
            <h1>Điều hành cửa hàng trà trong một màn hình.</h1>
            <p>
              Dữ liệu đơn hàng, khách hàng và tồn kho được tổng hợp trực tiếp từ
              PostgreSQL.
            </p>
          </div>
          <div className="admin-hero-panel" aria-label="Trạng thái hệ thống">
            <ShieldCheck aria-hidden="true" size={28} />
            <strong>Phiên đã xác thực</strong>
            <span>Mọi thao tác ghi đều được kiểm tra lại trên máy chủ.</span>
          </div>
        </div>
      </section>
      <section className="section-compact container admin-shell">
        <div className="admin-metrics">
          {metrics.map((metric) => (
            <article className="admin-card metric-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.delta}</small>
            </article>
          ))}
        </div>
        <div className="admin-grid">
          <section className="admin-card admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">Đơn hàng</p>
                <h2>Đơn mới trong ngày</h2>
              </div>
              <Link className="text-link" href="/admin/don-hang">
                Quản lý đơn
              </Link>
            </div>
            {orders.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Giá trị</th>
                      <th>Thanh toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customerName}</td>
                        <td>{formatVnd(order.total)}</td>
                        <td>
                          <span className="status-pill">
                            {order.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="muted">Chưa có đơn mới hôm nay.</p>
            )}
          </section>
          <aside className="admin-side">
            <section className="admin-card admin-panel">
              <p className="eyebrow">Lối tắt</p>
              <div className="admin-link-list">
                {quickLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link href={item.href} key={item.href}>
                      <Icon aria-hidden="true" size={20} />
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.description}</small>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </>
  );
}
