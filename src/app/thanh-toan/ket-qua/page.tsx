import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Kết quả thanh toán",
  robots: { index: false, follow: false },
};

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const orderId =
    typeof params.orderId === "string" ? params.orderId : "chưa xác định";
  const success = params.vnp_ResponseCode === "00" || params.resultCode === "0";

  return (
    <section className="section container">
      <div className="checkout-success payment-result">
        <p className="eyebrow">
          {success ? "Đã tiếp nhận kết quả" : "Thanh toán chưa hoàn tất"}
        </p>
        <h1>
          {success
            ? "Cảm ơn bạn. Hệ thống đang đối soát giao dịch."
            : "Bạn có thể thử lại hoặc chọn thanh toán khi nhận hàng."}
        </h1>
        <p>Mã đơn: {orderId}</p>
        <p>
          Trạng thái chính thức phải được xác nhận qua IPN từ cổng thanh toán,
          không chỉ dựa vào URL chuyển hướng trên trình duyệt.
        </p>
        <Link
          className={buttonVariants({ intent: "primary", size: "lg" })}
          href="/tai-khoan/don-hang"
        >
          Xem đơn hàng
        </Link>
      </div>
    </section>
  );
}
