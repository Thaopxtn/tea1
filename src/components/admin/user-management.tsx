"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Mail, Search, UserPlus, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { AdminUser } from "@/data/admin";

const segmentOptions: Array<AdminUser["segment"]> = [
  "Khách mới",
  "Khách thân thiết",
  "Đại lý",
  "Admin",
];

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function UserManagement({
  initialUsers,
}: {
  initialUsers: AdminUser[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState("");

  const filteredUsers = useMemo(() => {
    const needle = normalize(query.trim());
    return users.filter((user) => {
      const matchesQuery =
        !needle ||
        normalize([user.id, user.name, user.email].join(" ")).includes(needle);
      const matchesSegment = segment === "all" || user.segment === segment;
      return matchesQuery && matchesSegment;
    });
  }, [query, segment, users]);

  const resetFilters = () => {
    setQuery("");
    setSegment("all");
  };

  const addUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const nextUser: AdminUser = {
      id: `USR-${1025 + users.length}`,
      name: String(data.get("name")),
      email: String(data.get("email")),
      segment: String(data.get("segment")) as AdminUser["segment"],
      orders: 0,
      totalSpend: "0đ",
      lastSeen: "Vừa thêm",
      status: "Cần xác minh",
    };

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: nextUser.name,
        email: nextUser.email,
        segment: nextUser.segment,
      }),
    });
    const result = (await response.json()) as { id?: string; message?: string };
    if (!response.ok || !result.id) {
      setMessage(result.message ?? "Không thể lưu người dùng.");
      return;
    }

    setUsers((current) => [{ ...nextUser, id: result.id! }, ...current]);
    setMessage(`Đã thêm ${nextUser.name} vào hệ thống.`);
    toast.success("Đã thêm người dùng");
    form.reset();
    setDialogOpen(false);
  };

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-toolbar-group">
          <label className="admin-search">
            <Search aria-hidden="true" size={18} />
            <span className="sr-only">Tìm người dùng</span>
            <input
              type="search"
              value={query}
              placeholder="Tìm theo tên, email hoặc mã người dùng"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="admin-filter">
            <span>Phân nhóm</span>
            <select
              value={segment}
              onChange={(event) => setSegment(event.target.value)}
            >
              <option value="all">Tất cả</option>
              {segmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Trigger className="button button-primary button-md">
            <UserPlus aria-hidden="true" size={18} />
            Thêm người dùng
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="dialog-backdrop" />
            <Dialog.Viewport className="dialog-viewport">
              <Dialog.Popup className="search-popup admin-user-popup">
                <div className="dialog-heading">
                  <div>
                    <Dialog.Title>Thêm người dùng</Dialog.Title>
                    <Dialog.Description>
                      Tạo một bản ghi cục bộ để thử giao diện quản lý. Dữ liệu
                      sẽ mất khi tải lại trang.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close
                    className="icon-button"
                    aria-label="Đóng hộp thoại thêm người dùng"
                  >
                    <X aria-hidden="true" />
                  </Dialog.Close>
                </div>

                <form className="demo-form admin-user-form" onSubmit={addUser}>
                  <div className="field">
                    <label htmlFor="admin-user-name">Họ và tên</label>
                    <input
                      id="admin-user-name"
                      name="name"
                      minLength={2}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="admin-user-email">Email</label>
                    <input
                      id="admin-user-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="admin-user-segment">Phân nhóm</label>
                    <select
                      id="admin-user-segment"
                      name="segment"
                      defaultValue="Khách mới"
                    >
                      {segmentOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-user-form-actions">
                    <Dialog.Close
                      render={
                        <Button type="button" intent="secondary">
                          Hủy
                        </Button>
                      }
                    />
                    <Button type="submit">
                      <UserPlus aria-hidden="true" size={18} />
                      Thêm người dùng
                    </Button>
                  </div>
                </form>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <p className="form-message admin-live-message" aria-live="polite">
        {message}
      </p>

      <section className="admin-card admin-panel">
        <div className="admin-panel-heading admin-users-heading">
          <div>
            <p className="eyebrow">Danh sách</p>
            <h2>
              {filteredUsers.length} người dùng
              {filteredUsers.length !== users.length ? " phù hợp" : ""}
            </h2>
          </div>
          {(query || segment !== "all") && (
            <button className="text-link" type="button" onClick={resetFilters}>
              Xóa bộ lọc
            </button>
          )}
        </div>

        {filteredUsers.length ? (
          <>
            <p className="admin-table-note">
              Trên màn hình nhỏ, vuốt ngang trong bảng để xem đủ thông tin.
            </p>
            <div
              className="admin-table-wrap"
              role="region"
              aria-label="Danh sách người dùng có thể cuộn ngang"
              tabIndex={0}
            >
              <table className="admin-table users-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Phân nhóm</th>
                    <th>Đơn hàng</th>
                    <th>Chi tiêu</th>
                    <th>Lần cuối</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <span aria-hidden="true">{user.name.charAt(0)}</span>
                          <div>
                            <strong>{user.name}</strong>
                            <small>
                              <Mail aria-hidden="true" size={13} />
                              {user.email} · {user.id}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>{user.segment}</td>
                      <td>{user.orders}</td>
                      <td>{user.totalSpend}</td>
                      <td>{user.lastSeen}</td>
                      <td>
                        <span className="status-pill">{user.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="empty-state admin-empty">
            <h2>Không tìm thấy người dùng</h2>
            <p>Thử từ khóa khác hoặc xóa bộ lọc phân nhóm.</p>
            <Button onClick={resetFilters}>Xóa bộ lọc</Button>
          </div>
        )}
      </section>
    </>
  );
}
