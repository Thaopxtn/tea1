import "server-only";

import { cookies } from "next/headers";

import {
  ADMIN_COOKIE,
  getAdminSecret,
  verifyAdminToken,
} from "@/lib/admin-session";

export async function requireAdmin() {
  const mayBypass =
    process.env.NODE_ENV !== "production" &&
    process.env.ADMIN_AUTH_REQUIRED === "false";
  if (mayBypass) {
    return { email: "development@localhost", role: "ADMIN" as const };
  }

  const cookieStore = await cookies();
  return verifyAdminToken(
    cookieStore.get(ADMIN_COOKIE)?.value,
    getAdminSecret(),
  );
}
