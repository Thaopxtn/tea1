"use client";

import { CheckCircle2, RotateCcw, Truck } from "lucide-react";
import { useMemo, useState } from "react";

import { AddToCart } from "@/components/commerce/add-to-cart";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { Price } from "@/components/ui/price";
import { track } from "@/lib/analytics";
import type { Product } from "@/types/product";

export function ProductPurchase({ product }: { product: Product }) {
  const firstAvailable = product.variants.find((variant) => variant.stock > 0);
  const [variantId, setVariantId] = useState(
    firstAvailable?.id ?? product.variants[0].id,
  );
  const selected = useMemo(
    () =>
      product.variants.find((variant) => variant.id === variantId) ??
      product.variants[0],
    [product.variants, variantId],
  );

  return (
    <aside className="purchase-panel" aria-label="Thông tin mua hàng">
      <div className="product-badges">
        {product.badges.map((badge) => (
          <span className="badge-inline" key={badge}>
            {badge}
          </span>
        ))}
      </div>
      <h1>{product.name}</h1>
      <p className="muted">{product.shortDescription}</p>
      <Price value={selected.price} compareAt={selected.compareAtPrice} />
      <fieldset className="variant-fieldset">
        <legend>Chọn quy cách</legend>
        <div className="variant-grid">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              disabled={variant.stock === 0}
              aria-pressed={variant.id === selected.id}
              onClick={() => {
                setVariantId(variant.id);
                track("select_variant", {
                  productId: product.id,
                  variantId: variant.id,
                });
                window.history.replaceState(null, "", `?variant=${variant.id}`);
              }}
            >
              <span>{variant.label}</span>
              <small>
                {variant.stock ? `${variant.stock} còn lại` : "Hết hàng"}
              </small>
            </button>
          ))}
        </div>
      </fieldset>
      <div className="purchase-actions">
        <AddToCart
          productId={product.id}
          variantId={selected.id}
          disabled={selected.stock === 0}
        />
        <WishlistButton productId={product.id} />
      </div>
      <ul className="trust-list">
        <li>
          <Truck aria-hidden="true" size={18} /> Dự kiến giao 2–4 ngày làm việc
        </li>
        <li>
          <RotateCcw aria-hidden="true" size={18} /> Đổi trả theo chính sách
          trong 7 ngày
        </li>
        <li>
          <CheckCircle2 aria-hidden="true" size={18} /> Miễn phí vận chuyển từ
          600.000đ
        </li>
      </ul>
      <p className="demo-note">
        Giá và tồn kho được xác nhận lại khi đơn hàng được tạo hàng.
      </p>
    </aside>
  );
}
