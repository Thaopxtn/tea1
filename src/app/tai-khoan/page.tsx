import type { Metadata } from "next";
import Link from "next/link";
import { Heart, MapPin, Package, ShieldCheck, UserRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tài khoản",
  description:
    "Khu vực tài khoản để theo dõi đơn hàng, địa chỉ giao nhận và danh sách trà yêu thích.",
  robots: { index: false, follow: false },
};

const accountLinks = [
  {
    href: "/tai-khoan/don-hang",
    label: "Đơn hàng",
    description: "Xem các đơn thử nghiệm đã tạo trên thiết bị này.",
    icon: Package,
  },
  {
    href: "/tai-khoan/dia-chi",
    label: "Địa chỉ",
    description: "Kiểm tra giao diện nhập địa chỉ giao hàng.",
    icon: MapPin,
  },
  {
    href: "/yeu-thich",
    label: "Yêu thích",
    description: "Quay lại các loại trà bạn đã lưu để so sánh.",
    icon: Heart,
  },
];

export default function AccountPage() {
  return (
    <>
      <section className="page-hero account-hero">
        <div className="container account-hero-grid">
          <div>
            <p className="eyebrow">Tài khoản</p>
            <h1>Không gian riêng cho người mua trà.</h1>
            <p>
              Lưu lại những loại trà bạn quan tâm và xem các đơn đã tạo trên
              thiết bị này. Đây là khu vực trải nghiệm, chưa đồng bộ giữa các
              thiết bị.
            </p>
          </div>
          <div className="account-card">
            <UserRound aria-hidden="true" size={36} />
            <strong>Khách Mộc Sương</strong>
            <span>thanhvien.demo@example.com</span>
            <Link
              className={buttonVariants({ intent: "secondary", size: "sm" })}
              href="/tai-khoan/dang-nhap"
            >
              Đăng nhập thử
            </Link>
          </div>
        </div>
      </section>

      <section className="section-compact container account-layout">
        <div className="account-link-grid">
          {accountLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className="account-link-card"
                href={item.href}
                key={item.href}
              >
                <Icon aria-hidden="true" size={24} />
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              </Link>
            );
          })}
        </div>

        <aside className="account-note">
          <ShieldCheck aria-hidden="true" size={26} />
          <div>
            <p className="eyebrow">Ghi chú bảo mật</p>
            <h2>Dữ liệu chưa được đồng bộ.</h2>
            <p>
              Tài khoản hiện chỉ dùng để xem trước giao diện. Không nhập mật
              khẩu đang dùng ở dịch vụ khác hoặc thông tin cá nhân nhạy cảm.
            </p>
            <Link className="text-link" href="/san-pham">
              Về trang sản phẩm
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
