import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Suspense } from "react";

import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
  description: "Xác thực để truy cập khu vực quản trị Mộc Sương.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="section container admin-login-shell">
      <div className="admin-card admin-login-card">
        <ShieldCheck aria-hidden="true" size={32} />
        <p className="eyebrow">Khu vực được bảo vệ</p>
        <h1>Đăng nhập quản trị.</h1>
        <p>
          Phiên đăng nhập dùng cookie HTTP-only, tự hết hạn sau tám giờ. Hãy
          dùng thông tin quản trị riêng và không chia sẻ phiên đăng nhập.
        </p>
        <Suspense fallback={<p>Đang chuẩn bị biểu mẫu…</p>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </section>
  );
}
