"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { AdminOrder } from "@/data/admin";

const statuses: AdminOrder["status"][] = [
  "Mới",
  "Đang chuẩn bị",
  "Đã giao",
  "Cần gọi lại",
];

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function OrderManagement({
  initialOrders,
}: {
  initialOrders: AdminOrder[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const needle = normalize(query.trim());
    return orders.filter(
      (order) =>
        (!needle ||
          normalize(
            [order.id, order.customer, order.channel].join(" "),
          ).includes(needle)) &&
        (status === "all" || order.status === status),
    );
  }, [orders, query, status]);

  const updateStatus = async (id: string, nextStatus: AdminOrder["status"]) => {
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    const result = (await response.json()) as { message?: string };
    if (!response.ok) {
      toast.error(result.message ?? "Không thể cập nhật đơn hàng.");
      return;
    }
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? { ...order, status: nextStatus, updatedAt: "Vừa cập nhật" }
          : order,
      ),
    );
    toast.success(`Đã cập nhật ${id}`);
  };

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-toolbar-group">
          <label className="admin-search">
            <Search aria-hidden="true" size={18} />
            <span className="sr-only">Tìm đơn hàng</span>
            <input
              type="search"
              value={query}
              placeholder="Tìm mã đơn, khách hàng hoặc kênh"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="admin-filter">
            <span>Trạng thái</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">Tất cả</option>
              {statuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <section className="admin-card admin-panel">
        <div className="admin-panel-heading admin-users-heading">
          <div>
            <p className="eyebrow">Vận hành</p>
            <h2>{filtered.length} đơn hàng</h2>
          </div>
          <span className="muted">
            {orders.filter((order) => order.status === "Mới").length} đơn mới
          </span>
        </div>
        <div
          className="admin-table-wrap"
          role="region"
          aria-label="Danh sách đơn hàng có thể cuộn ngang"
          tabIndex={0}
        >
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Kênh</th>
                <th>Giá trị</th>
                <th>Cập nhật</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.id}</strong>
                  </td>
                  <td>{order.customer}</td>
                  <td>{order.channel}</td>
                  <td>{order.total}</td>
                  <td>{order.updatedAt}</td>
                  <td>
                    <label>
                      <span className="sr-only">Trạng thái đơn {order.id}</span>
                      <select
                        className="admin-status-select"
                        value={order.status}
                        onChange={(event) =>
                          updateStatus(
                            order.id,
                            event.target.value as AdminOrder["status"],
                          )
                        }
                      >
                        {statuses.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
