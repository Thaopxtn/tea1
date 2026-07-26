"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatVnd } from "@/lib/commerce";
import { useCommerceStore } from "@/store/commerce-store";

export function DemoOrders() {
  const hydrated = useHydrated();
  const orders = useCommerceStore((state) => state.orders);
  if (!hydrated) return <p>Đang đọc đơn hàng trên thiết bị…</p>;
  if (!orders.length) {
    return (
      <div className="empty-state">
        <h2>Chưa có đơn trên thiết bị này</h2>
        <p>Hoàn tất bước đặt hàng thử để đơn xuất hiện tại đây.</p>
        <Link
          className={buttonVariants({ intent: "primary" })}
          href="/san-pham"
        >
          Mua trà
        </Link>
      </div>
    );
  }
  return (
    <ul className="demo-orders">
      {orders.map((order) => (
        <li key={order.id}>
          <div>
            <strong>{order.id}</strong>
            <p>
              {new Intl.DateTimeFormat("vi-VN", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(order.createdAt))}
            </p>
          </div>
          <span>{formatVnd(order.total)}</span>
          <span className="demo-label">Đơn thử nghiệm</span>
        </li>
      ))}
    </ul>
  );
}
