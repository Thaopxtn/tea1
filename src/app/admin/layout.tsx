import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLogout } from "@/components/admin/admin-logout";
import { requireAdmin } from "@/lib/require-admin";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await requireAdmin())) redirect("/dang-nhap-admin");
  return (
    <>
      <div className="admin-session-bar">
        <div className="container">
          <span>Phiên quản trị · Mộc Sương</span>
          <AdminLogout />
        </div>
      </div>
      {children}
    </>
  );
}
