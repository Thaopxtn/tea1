"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { brandConfig } from "@/config/brand";
import { track } from "@/lib/analytics";

export function Footer() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <p className="brand-name">{brandConfig.name}</p>
          <p>{brandConfig.description}</p>
          {brandConfig.business.license ? (
            <p className="muted">{brandConfig.business.license}</p>
          ) : null}
        </div>
        <div>
          <h2>Sản phẩm</h2>
          <Link href="/danh-muc/tra-dinh">Trà Đinh</Link>
          <Link href="/danh-muc/non-tom">Trà Nõn Tôm</Link>
          <Link href="/danh-muc/moc-cau">Trà Móc Câu</Link>
          <Link href="/qua-tang">Hộp quà</Link>
        </div>
        <div>
          <h2>Hỗ trợ</h2>
          <Link href="/faq">Câu hỏi thường gặp</Link>
          <Link href={brandConfig.policies.shipping}>Giao hàng</Link>
          <Link href={brandConfig.policies.returns}>Đổi trả</Link>
          <Link href="/lien-he">Liên hệ</Link>
        </div>
        <div>
          <h2>Nhận thư từ đồi trà</h2>
          <p>
            Ghi chép mùa vụ, cách pha và bộ trà mới — tối đa hai thư mỗi tháng.
          </p>
          <form
            className="newsletter-form"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const email = String(new FormData(form).get("email") ?? "");
              setSubmitting(true);
              setMessage("");
              try {
                const response = await fetch("/api/newsletter", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                const result = (await response.json()) as { message?: string };
                if (!response.ok)
                  throw new Error(result.message ?? "Chưa thể đăng ký.");
                setMessage("Cảm ơn bạn. Đăng ký đã được ghi nhận.");
                track("newsletter_signup");
                form.reset();
              } catch (error) {
                setMessage(
                  error instanceof Error ? error.message : "Chưa thể đăng ký.",
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <label htmlFor="footer-email">Email</label>
            <div>
              <input
                id="footer-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="ban@example.com"
              />
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting ? "Đang gửi…" : "Đăng ký"}
              </Button>
            </div>
            <p className="form-message" aria-live="polite">
              {message}
            </p>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 {brandConfig.name}. Bảo lưu mọi quyền.</p>
        <div>
          <Link href={brandConfig.policies.privacy}>Bảo mật</Link>
          <Link href={brandConfig.policies.terms}>Điều khoản</Link>
          <span>VNPay · MoMo · Thanh toán khi nhận hàng</span>
        </div>
      </div>
    </footer>
  );
}
