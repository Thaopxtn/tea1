"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        setMessage(result.message ?? "Không thể đăng nhập.");
        return;
      }

      const next = searchParams.get("next");
      window.location.assign(next?.startsWith("/admin") ? next : "/admin");
    } catch {
      setMessage("Không thể kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="demo-form admin-login-form" onSubmit={login}>
      <div className="field">
        <label htmlFor="admin-login-email">Email quản trị</label>
        <input
          id="admin-login-email"
          name="email"
          type="email"
          autoComplete="username"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="admin-login-password">Mật khẩu</label>
        <input
          id="admin-login-password"
          name="password"
          type="password"
          minLength={8}
          autoComplete="current-password"
          required
        />
      </div>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Đang xác thực…" : "Đăng nhập quản trị"}
      </Button>
      <p className="field-error" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
