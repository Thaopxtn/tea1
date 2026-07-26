"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";
import { products } from "@/data/products";
import { useHydrated } from "@/hooks/use-hydrated";
import { track } from "@/lib/analytics";
import { checkoutSchema, type CheckoutValues } from "@/lib/checkout-schema";
import { calculateCartTotal, formatVnd } from "@/lib/commerce";
import { calculateShippingFee } from "@/lib/shipping";
import { useCommerceStore } from "@/store/commerce-store";

export function CheckoutForm({
  onlinePaymentsEnabled,
}: {
  onlinePaymentsEnabled: boolean;
}) {
  const hydrated = useHydrated();
  const cart = useCommerceStore((state) => state.cart);
  const saveOrder = useCommerceStore((state) => state.saveOrder);
  const clearCart = useCommerceStore((state) => state.clearCart);
  const [orderId, setOrderId] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const subtotal = useMemo(
    () =>
      calculateCartTotal(
        cart.flatMap((line) => {
          const product = products.find((item) => item.id === line.productId);
          const variant = product?.variants.find(
            (item) => item.id === line.variantId,
          );
          return variant
            ? [{ price: variant.price, quantity: line.quantity }]
            : [];
        }),
      ),
    [cart],
  );
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { email: "", note: "", payment: "cod" },
  });
  const province = useWatch({ control, name: "province" });
  const shippingFee = calculateShippingFee(subtotal, province ?? "");
  const estimatedTotal = subtotal + shippingFee;

  if (!hydrated)
    return (
      <div className="empty-state">
        <p>Đang chuẩn bị thanh toán…</p>
      </div>
    );
  if (orderId) {
    return (
      <div className="checkout-success">
        <p className="eyebrow">Đơn hàng đã được tiếp nhận</p>
        <h2>Cảm ơn bạn. Mã đơn: {orderId}</h2>
        <p>{orderMessage}</p>
        <Link
          className={buttonVariants({ intent: "primary", size: "lg" })}
          href="/tai-khoan/don-hang"
        >
          Xem đơn hàng
        </Link>
      </div>
    );
  }
  if (!cart.length) {
    return (
      <div className="empty-state">
        <h2>Không có sản phẩm để thanh toán</h2>
        <p>Giỏ hàng có thể đã được hoàn tất ở một tab khác.</p>
        <Link
          className={buttonVariants({ intent: "primary", size: "lg" })}
          href="/san-pham"
        >
          Chọn sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <form
        className="checkout-form"
        noValidate
        onSubmit={handleSubmit(async (values) => {
          setCheckoutError("");
          try {
            const orderResponse = await fetch("/api/orders", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                customer: {
                  fullName: values.fullName,
                  phone: values.phone,
                  email: values.email,
                  province: values.province,
                  district: values.district,
                  ward: values.ward,
                  address: values.address,
                  note: values.note,
                },
                payment: values.payment,
                lines: cart,
              }),
            });
            const order = (await orderResponse.json()) as {
              orderId?: string;
              total?: number;
              message?: string;
              mode?: "database";
            };
            if (!orderResponse.ok || !order.orderId || !order.total) {
              throw new Error(order.message ?? "Không thể tạo đơn hàng.");
            }

            if (values.payment === "vnpay" || values.payment === "momo") {
              const paymentResponse = await fetch("/api/payments/create", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  provider: values.payment,
                  orderId: order.orderId,
                }),
              });
              const payment = (await paymentResponse.json()) as {
                checkoutUrl?: string;
                message?: string;
                mode?: "live";
              };
              if (!paymentResponse.ok) {
                throw new Error(
                  payment.message ?? "Không thể khởi tạo thanh toán.",
                );
              }
              if (payment.mode === "live" && payment.checkoutUrl) {
                window.location.assign(payment.checkoutUrl);
                return;
              }
              throw new Error(
                payment.message ?? "Không nhận được liên kết thanh toán.",
              );
            } else {
              setOrderMessage(
                "Đơn đã được lưu vào hệ thống và sẽ được xác nhận trước khi giao.",
              );
            }

            saveOrder({
              id: order.orderId,
              createdAt: new Date().toISOString(),
              total: order.total,
            });
            clearCart();
            setOrderId(order.orderId);
            track("add_shipping_info");
            track("add_payment_info", { provider: values.payment });
            track("purchase", {
              orderId: order.orderId,
              total: order.total,
            });
          } catch (error) {
            setCheckoutError(
              error instanceof Error
                ? error.message
                : "Không thể hoàn tất đơn hàng.",
            );
          }
        })}
      >
        <h2 className="field-full">Thông tin nhận hàng</h2>
        <div className="field">
          <label htmlFor="fullName">Họ và tên</label>
          <input
            id="fullName"
            autoComplete="name"
            aria-invalid={Boolean(errors.fullName)}
            {...register("fullName")}
          />
          {errors.fullName ? (
            <p className="field-error">{errors.fullName.message}</p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            id="phone"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="field-error">{errors.phone.message}</p>
          ) : null}
        </div>
        <div className="field field-full">
          <label htmlFor="email">Email (không bắt buộc)</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? (
            <p className="field-error">{errors.email.message}</p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="province">Tỉnh/thành</label>
          <input
            id="province"
            autoComplete="address-level1"
            aria-invalid={Boolean(errors.province)}
            {...register("province")}
          />
          {errors.province ? (
            <p className="field-error">{errors.province.message}</p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="district">Quận/huyện</label>
          <input
            id="district"
            autoComplete="address-level2"
            aria-invalid={Boolean(errors.district)}
            {...register("district")}
          />
          {errors.district ? (
            <p className="field-error">{errors.district.message}</p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="ward">Phường/xã</label>
          <input
            id="ward"
            autoComplete="address-level3"
            aria-invalid={Boolean(errors.ward)}
            {...register("ward")}
          />
          {errors.ward ? (
            <p className="field-error">{errors.ward.message}</p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="address">Địa chỉ cụ thể</label>
          <input
            id="address"
            autoComplete="street-address"
            aria-invalid={Boolean(errors.address)}
            {...register("address")}
          />
          {errors.address ? (
            <p className="field-error">{errors.address.message}</p>
          ) : null}
        </div>
        <div className="field field-full">
          <label htmlFor="note">Ghi chú</label>
          <textarea id="note" rows={3} {...register("note")} />
        </div>
        <fieldset className="field field-full">
          <legend className="field-label">Phương thức thanh toán</legend>
          <div className="payment-options">
            <label>
              <input type="radio" value="cod" {...register("payment")} />
              Thanh toán khi nhận hàng
            </label>
            {onlinePaymentsEnabled ? (
              <>
                <label>
                  <input type="radio" value="vnpay" {...register("payment")} />
                  VNPay
                </label>
                <label>
                  <input type="radio" value="momo" {...register("payment")} />
                  Ví MoMo
                </label>
              </>
            ) : null}
          </div>
        </fieldset>
        <Button
          className="field-full"
          type="submit"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang tạo đơn…" : "Hoàn thành đơn hàng"}
        </Button>
        <p className="field-error field-full" aria-live="polite">
          {checkoutError}
        </p>
      </form>
      <aside className="order-summary">
        <h2>Tổng đơn</h2>
        <div className="summary-row">
          <span>Sản phẩm</span>
          <strong>{cart.reduce((sum, line) => sum + line.quantity, 0)}</strong>
        </div>
        <div className="summary-row">
          <span>Tạm tính</span>
          <strong>{formatVnd(subtotal)}</strong>
        </div>
        <div className="summary-row">
          <span>Vận chuyển</span>
          <strong>{shippingFee ? formatVnd(shippingFee) : "Miễn phí"}</strong>
        </div>
        <div className="summary-row summary-total">
          <span>Tổng dự tính</span>
          <strong>{formatVnd(estimatedTotal)}</strong>
        </div>
        <p className="demo-note">
          Giá và tồn kho được xác nhận lại trên máy chủ trước khi đơn hàng được
          tạo.
        </p>
      </aside>
    </div>
  );
}
