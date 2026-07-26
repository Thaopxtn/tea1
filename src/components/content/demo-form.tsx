"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

export function DemoForm({
  mode,
}: {
  mode: "login" | "register" | "contact" | "address";
}) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isContact = mode === "contact";

  return (
    <form
      className="demo-form"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        if (!isContact) {
          setMessage(
            "Tính năng tài khoản chưa được mở. Vui lòng đặt hàng với tư cách khách.",
          );
          return;
        }
        const data = new FormData(form);
        setSubmitting(true);
        setMessage("");
        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              name: String(data.get("name") ?? ""),
              email: String(data.get("email") ?? ""),
              phone: String(data.get("phone") ?? ""),
              message: String(data.get("message") ?? ""),
            }),
          });
          const result = (await response.json()) as { message?: string };
          if (!response.ok)
            throw new Error(result.message ?? "Chưa thể gửi yêu cầu.");
          track("contact_wholesale");
          setMessage("Yêu cầu đã được gửi. Chúng tôi sẽ phản hồi sớm.");
          form.reset();
        } catch (error) {
          setMessage(
            error instanceof Error ? error.message : "Chưa thể gửi yêu cầu.",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {mode === "register" || mode === "contact" || mode === "address" ? (
        <div className="field">
          <label htmlFor={`${mode}-name`}>
            {mode === "address" ? "Tên người nhận" : "Họ và tên"}
          </label>
          <input
            id={`${mode}-name`}
            name="name"
            minLength={2}
            maxLength={100}
            required
            autoComplete="name"
          />
        </div>
      ) : null}
      {mode !== "address" ? (
        <div className="field">
          <label htmlFor={`${mode}-email`}>Email</label>
          <input
            id={`${mode}-email`}
            name="email"
            type="email"
            maxLength={254}
            required
            autoComplete="email"
          />
        </div>
      ) : null}
      {mode === "login" || mode === "register" ? (
        <div className="field">
          <label htmlFor={`${mode}-password`}>Mật khẩu</label>
          <input
            id={`${mode}-password`}
            name="password"
            type="password"
            minLength={12}
            maxLength={256}
            required
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
          <small>Tối thiểu 12 ký tự.</small>
        </div>
      ) : null}
      {isContact ? (
        <>
          <div className="field">
            <label htmlFor="contact-phone">Số điện thoại</label>
            <input
              id="contact-phone"
              name="phone"
              inputMode="tel"
              pattern="^(0|\+84)(3|5|7|8|9)[0-9]{8}$"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="contact-message">Nội dung</label>
            <textarea
              id="contact-message"
              name="message"
              minLength={10}
              maxLength={2000}
              rows={5}
              required
            />
          </div>
        </>
      ) : null}
      {mode === "address" ? (
        <div className="field">
          <label htmlFor="local-address">Địa chỉ đầy đủ</label>
          <textarea
            id="local-address"
            name="address"
            minLength={8}
            maxLength={240}
            rows={4}
            required
          />
        </div>
      ) : null}
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting
          ? "Đang gửi…"
          : isContact
            ? "Gửi yêu cầu"
            : "Kiểm tra thông tin"}
      </Button>
      <p className="form-message" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
