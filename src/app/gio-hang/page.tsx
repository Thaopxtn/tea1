import type { Metadata } from "next";

import { CartPageClient } from "@/components/commerce/cart-page-client";

export const metadata: Metadata = {
  title: "Giỏ hàng",
  description:
    "Kiểm tra sản phẩm, quy cách, số lượng, phí vận chuyển và tổng đơn hàng.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Giỏ hàng lưu trên thiết bị</p>
          <h1>Giỏ trà của bạn.</h1>
          <p>
            Sửa số lượng, áp mã MOCSUONG10 và kiểm tra ngưỡng miễn phí vận
            chuyển.
          </p>
        </div>
      </section>
      <section className="section-compact container">
        <CartPageClient />
      </section>
    </>
  );
}
