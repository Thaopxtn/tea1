"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { products } from "@/data/products";
import { useHydrated } from "@/hooks/use-hydrated";
import { applyDemoCoupon, calculateCartTotal, formatVnd } from "@/lib/commerce";
import { track } from "@/lib/analytics";
import { useCommerceStore } from "@/store/commerce-store";

export function CartPageClient() {
  const hydrated = useHydrated();
  const cart = useCommerceStore((state) => state.cart);
  const updateQuantity = useCommerceStore((state) => state.updateQuantity);
  const removeFromCart = useCommerceStore((state) => state.removeFromCart);
  const addToCart = useCommerceStore((state) => state.addToCart);
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const lines = useMemo(
    () =>
      cart.flatMap((line) => {
        const product = products.find((item) => item.id === line.productId);
        const variant = product?.variants.find(
          (item) => item.id === line.variantId,
        );
        return product && variant ? [{ ...line, product, variant }] : [];
      }),
    [cart],
  );
  const subtotal = calculateCartTotal(
    lines.map((line) => ({
      price: line.variant.price,
      quantity: line.quantity,
    })),
  );
  const discount = applyDemoCoupon(subtotal, couponMessage ? coupon : "");
  const shipping = subtotal - discount >= 600_000 || !subtotal ? 0 : 35_000;
  const total = subtotal - discount + shipping;

  if (!hydrated) {
    return (
      <div className="empty-state" aria-live="polite">
        <p>Đang đọc giỏ hàng trên thiết bị…</p>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="empty-state">
        <h2>Giỏ hàng đang trống</h2>
        <p>Thêm một gói thử để bắt đầu khám phá trà Thái Nguyên.</p>
        <Link
          className={buttonVariants({ intent: "primary", size: "lg" })}
          href="/san-pham"
        >
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div>
        <ul className="cart-list">
          {lines.map((line) => (
            <li
              className="cart-line"
              key={`${line.product.id}-${line.variant.id}`}
            >
              <Image
                src={line.product.images[0].src}
                alt=""
                width={112}
                height={112}
              />
              <div>
                <p className="eyebrow">{line.product.region}</p>
                <h3>
                  <Link href={`/san-pham/${line.product.slug}`}>
                    {line.product.name}
                  </Link>
                </h3>
                <p className="muted">
                  {line.variant.label} ·{" "}
                  {line.variant.packaging.replace("-", " ")}
                </p>
                <div
                  className="quantity-control"
                  aria-label={`Số lượng ${line.product.name}`}
                >
                  <button
                    type="button"
                    aria-label="Giảm số lượng"
                    onClick={() =>
                      updateQuantity(
                        line.product.id,
                        line.variant.id,
                        line.quantity - 1,
                      )
                    }
                  >
                    <Minus aria-hidden="true" size={16} />
                  </button>
                  <span aria-live="polite">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label="Tăng số lượng"
                    onClick={() =>
                      updateQuantity(
                        line.product.id,
                        line.variant.id,
                        line.quantity + 1,
                      )
                    }
                  >
                    <Plus aria-hidden="true" size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  className="remove-line"
                  onClick={() => {
                    removeFromCart(line.product.id, line.variant.id);
                    track("remove_from_cart", { productId: line.product.id });
                    toast("Đã xóa sản phẩm", {
                      action: {
                        label: "Hoàn tác",
                        onClick: () =>
                          addToCart(
                            line.product.id,
                            line.variant.id,
                            line.quantity,
                          ),
                      },
                    });
                  }}
                >
                  <Trash2 aria-hidden="true" size={15} /> Xóa
                </button>
              </div>
              <Price value={line.variant.price * line.quantity} />
            </li>
          ))}
        </ul>
      </div>
      <aside className="order-summary" aria-label="Tóm tắt đơn hàng">
        <h2>Tóm tắt</h2>
        <div className="summary-row">
          <span>Tạm tính</span>
          <strong>{formatVnd(subtotal)}</strong>
        </div>
        <div className="summary-row">
          <span>Giảm giá</span>
          <strong>−{formatVnd(discount)}</strong>
        </div>
        <div className="summary-row">
          <span>Vận chuyển dự kiến</span>
          <strong>{shipping ? formatVnd(shipping) : "Miễn phí"}</strong>
        </div>
        <div className="summary-row summary-total">
          <span>Tổng</span>
          <strong>{formatVnd(total)}</strong>
        </div>
        <form
          className="coupon-form"
          onSubmit={(event) => {
            event.preventDefault();
            const saving = applyDemoCoupon(subtotal, coupon);
            setCouponMessage(
              saving
                ? `Đã giảm ${formatVnd(saving)}.`
                : "Mã chưa hợp lệ. Thử MOCSUONG10.",
            );
          }}
        >
          <label htmlFor="coupon">Mã ưu đãi</label>
          <div>
            <input
              id="coupon"
              value={coupon}
              onChange={(event) => setCoupon(event.target.value)}
              placeholder="MOCSUONG10"
            />
            <Button type="submit" size="sm" intent="secondary">
              Áp dụng
            </Button>
          </div>
          <p aria-live="polite">{couponMessage}</p>
        </form>
        <Link
          className={buttonVariants({ intent: "primary", size: "lg" })}
          href="/thanh-toan"
          onClick={() => track("begin_checkout")}
        >
          Tiến hành thanh toán
        </Link>
        <p className="demo-note">
          Giá, ưu đãi và tồn kho sẽ được xác nhận lại khi tạo đơn.
        </p>
      </aside>
    </div>
  );
}
