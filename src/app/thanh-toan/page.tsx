import type { Metadata } from "next";

import { CheckoutForm } from "@/components/commerce/checkout-form";

export const metadata: Metadata = {
  title: "Thông tin giao hàng và thanh toán",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Thanh toán an toàn</p>
          <h1>Thông tin giao hàng.</h1>
          <p>
            Biểu mẫu hoạt động và lưu đơn cục bộ, nhưng không gửi dữ liệu hay
            tạo thanh toán thật.
          </p>
        </div>
      </section>
      <section className="section-compact container">
        <CheckoutForm
          onlinePaymentsEnabled={process.env.PAYMENT_MODE === "live"}
        />
      </section>
    </>
  );
}
