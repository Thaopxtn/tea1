"use client";

import { Dialog } from "@base-ui/react/dialog";
import { PackagePlus, Search, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/commerce";

export type AdminProductRow = {
  id: string;
  name: string;
  sku: string;
  category: string;
  region: string;
  price: number;
  stock: number;
  active: boolean;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function ProductManagement({
  initialProducts,
}: {
  initialProducts: AdminProductRow[];
}) {
  const [items, setItems] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = normalize(query.trim());
    return items.filter((item) => {
      const matchesQuery =
        !needle ||
        normalize([item.name, item.sku, item.region].join(" ")).includes(
          needle,
        );
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "available" && item.stock > 5) ||
        (stockFilter === "low" && item.stock > 0 && item.stock <= 5) ||
        (stockFilter === "out" && item.stock === 0);
      return matchesQuery && matchesStock;
    });
  }, [items, query, stockFilter]);

  const patchItem = async (id: string, patch: Partial<AdminProductRow>) => {
    const response = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    const result = (await response.json()) as { message?: string };
    if (!response.ok) {
      toast.error(result.message ?? "Không thể cập nhật sản phẩm.");
      return;
    }
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
    toast.success("Đã cập nhật sản phẩm");
  };
  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const draft = {
      name: String(data.get("name")),
      sku: String(data.get("sku")).toUpperCase(),
      category: String(data.get("category")),
      region: String(data.get("region")),
      price: Number(data.get("price")),
      stock: Number(data.get("stock")),
      active: true,
    };
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
    const result = (await response.json()) as { id?: string; message?: string };
    if (!response.ok || !result.id) {
      toast.error(result.message ?? "Không thể tạo sản phẩm.");
      return;
    }
    setItems((current) => [{ id: result.id!, ...draft }, ...current]);
    toast.success("Đã thêm sản phẩm");
    form.reset();
    setOpen(false);
  };

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-toolbar-group">
          <label className="admin-search">
            <Search aria-hidden="true" size={18} />
            <span className="sr-only">Tìm sản phẩm</span>
            <input
              type="search"
              value={query}
              placeholder="Tìm theo tên, SKU hoặc vùng chè"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="admin-filter">
            <span>Tồn kho</span>
            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="available">Còn hàng</option>
              <option value="low">Sắp hết</option>
              <option value="out">Hết hàng</option>
            </select>
          </label>
        </div>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger className="button button-primary button-md">
            <PackagePlus aria-hidden="true" size={18} />
            Thêm sản phẩm
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="dialog-backdrop" />
            <Dialog.Viewport className="dialog-viewport">
              <Dialog.Popup className="search-popup admin-user-popup">
                <div className="dialog-heading">
                  <div>
                    <Dialog.Title>Thêm sản phẩm</Dialog.Title>
                    <Dialog.Description>
                      Bản ghi sẽ được gửi tới API; nếu chưa cấu hình PostgreSQL,
                      dữ liệu chỉ tồn tại trong phiên hiện tại.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close
                    className="icon-button"
                    aria-label="Đóng hộp thoại thêm sản phẩm"
                  >
                    <X aria-hidden="true" />
                  </Dialog.Close>
                </div>
                <form
                  className="demo-form admin-user-form"
                  onSubmit={addProduct}
                >
                  <div className="field">
                    <label htmlFor="product-name">Tên sản phẩm</label>
                    <input
                      id="product-name"
                      name="name"
                      minLength={3}
                      required
                    />
                  </div>
                  <div className="admin-form-grid">
                    <div className="field">
                      <label htmlFor="product-sku">SKU</label>
                      <input
                        id="product-sku"
                        name="sku"
                        minLength={3}
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="product-category">Phẩm trà</label>
                      <select
                        id="product-category"
                        name="category"
                        defaultValue="moc-cau"
                      >
                        <option value="tra-dinh">Trà Đinh</option>
                        <option value="non-tom">Trà Nõn Tôm</option>
                        <option value="moc-cau">Trà Móc Câu</option>
                        <option value="tra-bup">Trà Búp</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="product-region">Vùng chè</label>
                      <input
                        id="product-region"
                        name="region"
                        defaultValue="Tân Cương"
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="product-price">Giá bán (đ)</label>
                      <input
                        id="product-price"
                        name="price"
                        type="number"
                        min={1000}
                        step={1000}
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="product-stock">Tồn kho</label>
                      <input
                        id="product-stock"
                        name="stock"
                        type="number"
                        min={0}
                        defaultValue={10}
                        required
                      />
                    </div>
                  </div>
                  <div className="admin-user-form-actions">
                    <Dialog.Close
                      render={
                        <Button type="button" intent="secondary">
                          Hủy
                        </Button>
                      }
                    />
                    <Button type="submit">Lưu sản phẩm</Button>
                  </div>
                </form>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <section className="admin-card admin-panel">
        <div className="admin-panel-heading admin-users-heading">
          <div>
            <p className="eyebrow">Kho hàng</p>
            <h2>{filtered.length} sản phẩm</h2>
          </div>
          <span className="muted">
            {items.filter((item) => item.stock <= 5).length} sản phẩm cần chú ý
          </span>
        </div>
        {filtered.length ? (
          <div
            className="admin-table-wrap"
            role="region"
            aria-label="Danh sách sản phẩm có thể cuộn ngang"
            tabIndex={0}
          >
            <table className="admin-table admin-product-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Phẩm trà</th>
                  <th>Vùng</th>
                  <th>Giá từ</th>
                  <th>Tồn kho</th>
                  <th>Hiển thị</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      <small className="admin-cell-note">{item.sku}</small>
                    </td>
                    <td>{item.category}</td>
                    <td>{item.region}</td>
                    <td>{formatVnd(item.price)}</td>
                    <td>
                      <div className="stock-control">
                        <button
                          type="button"
                          aria-label={`Giảm tồn kho ${item.name}`}
                          onClick={() =>
                            patchItem(item.id, {
                              stock: Math.max(0, item.stock - 1),
                            })
                          }
                        >
                          −
                        </button>
                        <span>{item.stock}</span>
                        <button
                          type="button"
                          aria-label={`Tăng tồn kho ${item.name}`}
                          onClick={() =>
                            patchItem(item.id, { stock: item.stock + 1 })
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        className={`status-pill ${item.active ? "" : "is-muted"}`}
                        type="button"
                        aria-pressed={item.active}
                        onClick={() =>
                          patchItem(item.id, { active: !item.active })
                        }
                      >
                        {item.active ? "Đang bán" : "Đã ẩn"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state admin-empty">
            <h2>Không có sản phẩm phù hợp</h2>
            <Button
              onClick={() => {
                setQuery("");
                setStockFilter("all");
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
