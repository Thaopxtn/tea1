import type { Metadata } from "next";
import { WishlistPageClient } from "@/components/commerce/wishlist-page-client";

export const metadata: Metadata = {
  title: "Sản phẩm yêu thích",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Lưu trên thiết bị</p>
          <h1>Trà bạn muốn gặp lại.</h1>
          <p>
            Danh sách này chỉ được lưu trên thiết bị hiện tại và chưa đồng bộ
            sang thiết bị khác.
          </p>
        </div>
      </section>
      <section className="section-compact container">
        <WishlistPageClient />
      </section>
    </>
  );
}
