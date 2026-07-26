"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

export function AdminLogout() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <button
      className="text-link"
      type="button"
      disabled={submitting}
      onClick={async () => {
        setSubmitting(true);
        await fetch("/api/auth/admin/logout", { method: "POST" });
        window.location.assign("/dang-nhap-admin");
      }}
    >
      <LogOut aria-hidden="true" size={16} />
      {submitting ? "Đang đăng xuất…" : "Đăng xuất"}
    </button>
  );
}
