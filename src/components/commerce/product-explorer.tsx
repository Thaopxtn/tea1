"use client";

import { Dialog } from "@base-ui/react/dialog";
import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import type { Product } from "@/types/product";

const categoryOptions = [
  ["tra-dinh", "Trà Đinh"],
  ["non-tom", "Trà Nõn Tôm"],
  ["moc-cau", "Trà Móc Câu"],
  ["tra-bup", "Trà Búp"],
  ["hop-qua", "Hộp quà"],
  ["tra-cu", "Trà cụ"],
] as const;

function FilterContent({
  selectedCategories,
  regions,
  caffeine,
  inStock,
  onToggle,
  onClear,
}: {
  selectedCategories: string[];
  regions: string[];
  caffeine: string[];
  inStock: boolean;
  onToggle: (key: string, value: string, checked: boolean) => void;
  onClear: () => void;
}) {
  return (
    <>
      <div className="filter-clear">
        <strong>Bộ lọc</strong>
        <button type="button" onClick={onClear}>
          Xóa tất cả
        </button>
      </div>
      <fieldset>
        <legend>Phẩm trà</legend>
        {categoryOptions.map(([value, label]) => (
          <label key={value}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(value)}
              onChange={(event) =>
                onToggle("category", value, event.target.checked)
              }
            />
            {label}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Vùng chè</legend>
        {["Tân Cương", "La Bằng", "Trại Cài", "Khe Cốc"].map((region) => (
          <label key={region}>
            <input
              type="checkbox"
              checked={regions.includes(region)}
              onChange={(event) =>
                onToggle("region", region, event.target.checked)
              }
            />
            {region}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Mức caffeine</legend>
        {[
          ["low", "Thấp"],
          ["medium", "Vừa"],
          ["high", "Cao"],
        ].map(([value, label]) => (
          <label key={value}>
            <input
              type="checkbox"
              checked={caffeine.includes(value)}
              onChange={(event) =>
                onToggle("caffeine", value, event.target.checked)
              }
            />
            {label}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Tình trạng</legend>
        <label>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(event) => onToggle("stock", "1", event.target.checked)}
          />
          Chỉ hiện sản phẩm còn hàng
        </label>
      </fieldset>
    </>
  );
}

export function ProductExplorer({
  items,
  fixedCategory,
  fixedCollection,
}: {
  items: Product[];
  fixedCategory?: string;
  fixedCollection?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const selectedCategories = params.getAll("category");
  const regions = params.getAll("region");
  const caffeine = params.getAll("caffeine");
  const inStock = params.get("stock") === "1";
  const sort = params.get("sort") ?? "featured";
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setInteractive(true));
  }, []);

  const setParams = (next: URLSearchParams) => {
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const onToggle = (key: string, value: string, checked: boolean) => {
    const next = new URLSearchParams(params.toString());
    if (checked) next.append(key, value);
    else {
      const remaining = next.getAll(key).filter((item) => item !== value);
      next.delete(key);
      remaining.forEach((item) => next.append(key, item));
    }
    track("apply_filter", { key, selected: checked });
    setParams(next);
  };

  const clear = () => {
    const next = new URLSearchParams();
    if (sort !== "featured") next.set("sort", sort);
    setParams(next);
  };

  const filtered = useMemo(() => {
    const result = items.filter((product) => {
      const categoryMatch =
        (fixedCategory ? product.category === fixedCategory : true) &&
        (!selectedCategories.length ||
          selectedCategories.includes(product.category));
      const collectionMatch = fixedCollection
        ? product.collection === fixedCollection
        : true;
      return (
        categoryMatch &&
        collectionMatch &&
        (!regions.length || regions.includes(product.region)) &&
        (!caffeine.length || caffeine.includes(product.caffeineLevel)) &&
        (!inStock || product.stockStatus !== "out-of-stock")
      );
    });
    return [...result].sort((a, b) => {
      const aPrice = Math.min(...a.variants.map((variant) => variant.price));
      const bPrice = Math.min(...b.variants.map((variant) => variant.price));
      if (sort === "price-asc") return aPrice - bPrice;
      if (sort === "price-desc") return bPrice - aPrice;
      if (sort === "name") return a.name.localeCompare(b.name, "vi");
      if (sort === "newest")
        return (b.harvestDate ?? "").localeCompare(a.harvestDate ?? "");
      return Number(b.featured) - Number(a.featured);
    });
  }, [
    caffeine,
    fixedCategory,
    fixedCollection,
    inStock,
    items,
    regions,
    selectedCategories,
    sort,
  ]);

  const filterProps = {
    selectedCategories,
    regions,
    caffeine,
    inStock,
    onToggle,
    onClear: clear,
  };

  return (
    <div
      className="filter-layout"
      data-interactive={interactive ? "true" : "false"}
    >
      <aside
        className="filter-panel desktop-filter"
        aria-label="Bộ lọc sản phẩm"
      >
        <FilterContent {...filterProps} />
      </aside>
      <div>
        <div className="collection-toolbar">
          <p aria-live="polite">
            <strong>{filtered.length}</strong> sản phẩm
          </p>
          <Dialog.Root>
            <Dialog.Trigger className="button button-secondary button-sm mobile-filter">
              <SlidersHorizontal aria-hidden="true" size={17} /> Lọc
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="dialog-backdrop" />
              <Dialog.Viewport className="dialog-viewport">
                <Dialog.Popup className="mobile-drawer filter-drawer">
                  <div className="dialog-heading">
                    <Dialog.Title>Lọc sản phẩm</Dialog.Title>
                    <Dialog.Description className="sr-only">
                      Chọn phẩm trà, vùng chè, caffeine và tình trạng kho
                    </Dialog.Description>
                    <Dialog.Close
                      className="icon-button"
                      aria-label="Đóng bộ lọc"
                    >
                      <X aria-hidden="true" />
                    </Dialog.Close>
                  </div>
                  <div className="filter-panel">
                    <FilterContent {...filterProps} />
                  </div>
                  <Dialog.Close
                    render={
                      <Button className="filter-apply">
                        Xem {filtered.length} sản phẩm
                      </Button>
                    }
                  />
                </Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          </Dialog.Root>
          <label>
            <span className="sr-only">Sắp xếp</span>
            <select
              value={sort}
              onChange={(event) => {
                const next = new URLSearchParams(params.toString());
                next.set("sort", event.target.value);
                setParams(next);
              }}
            >
              <option value="featured">Nổi bật</option>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name">Tên A–Z</option>
            </select>
          </label>
        </div>
        {filtered.length ? (
          <div className="product-grid" suppressHydrationWarning>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Chưa có sản phẩm phù hợp</h2>
            <p>Hãy bỏ bớt một bộ lọc hoặc xem toàn bộ danh mục.</p>
            <Button onClick={clear}>Xóa bộ lọc</Button>
          </div>
        )}
      </div>
    </div>
  );
}
