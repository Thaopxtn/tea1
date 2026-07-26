"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { products } from "@/data/products";
import { track } from "@/lib/analytics";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function SearchDialog() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return products.slice(0, 4);
    return products
      .filter((product) =>
        normalize(
          [product.name, product.region, product.sku, ...product.aroma].join(
            " ",
          ),
        ).includes(needle),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <Dialog.Root>
      <Dialog.Trigger className="icon-button" aria-label="Mở tìm kiếm">
        <Search aria-hidden="true" size={21} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop" />
        <Dialog.Viewport className="dialog-viewport">
          <Dialog.Popup className="search-popup">
            <div className="dialog-heading">
              <div>
                <Dialog.Title>Tìm trà phù hợp</Dialog.Title>
                <Dialog.Description>
                  Tìm theo tên, vùng chè, hương vị, danh mục hoặc mã sản phẩm.
                </Dialog.Description>
              </div>
              <Dialog.Close className="icon-button" aria-label="Đóng tìm kiếm">
                <X aria-hidden="true" />
              </Dialog.Close>
            </div>
            <label className="search-field">
              <Search aria-hidden="true" size={20} />
              <span className="sr-only">Từ khóa tìm kiếm</span>
              <input
                autoFocus
                type="search"
                value={query}
                placeholder="Ví dụ: Trà Nõn Tôm, Tân Cương, cốm non…"
                onChange={(event) => {
                  setQuery(event.target.value);
                  track("search", { queryLength: event.target.value.length });
                }}
              />
            </label>
            <div className="search-results" aria-live="polite">
              <p className="eyebrow">
                {query ? `${results.length} kết quả` : "Gợi ý hôm nay"}
              </p>
              {results.length ? (
                <ul>
                  {results.map((product) => (
                    <li key={product.id}>
                      <Dialog.Close
                        nativeButton={false}
                        render={
                          <Link href={`/san-pham/${product.slug}`}>
                            <span>{product.name}</span>
                            <small>
                              {product.region} · {product.shortDescription}
                            </small>
                          </Link>
                        }
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state">
                  <p>Chưa tìm thấy trà phù hợp.</p>
                  <Link href="/san-pham">Xem toàn bộ sản phẩm</Link>
                </div>
              )}
            </div>
            <Link
              className="text-link"
              href={`/tim-kiem?q=${encodeURIComponent(query)}`}
            >
              Mở trang kết quả đầy đủ
            </Link>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
