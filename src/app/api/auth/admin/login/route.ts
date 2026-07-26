import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  ADMIN_COOKIE,
  createAdminToken,
  getAdminSecret,
} from "@/lib/admin-session";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import {
  getClientKey,
  isSameOrigin,
  readJsonBody,
  RequestValidationError,
} from "@/lib/server/request-security";

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(256),
});

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
};

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { message: "Yêu cầu không được phép." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await readJsonBody(request, 8 * 1024);
  } catch (error) {
    const message =
      error instanceof RequestValidationError
        ? error.message
        : "Yêu cầu không hợp lệ.";
    return NextResponse.json({ message }, { status: 400 });
  }

  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: "Email hoặc mật khẩu chưa hợp lệ." },
      { status: 400 },
    );
  }

  const rate = consumeRateLimit(
    `admin-login:${getClientKey(request)}:${result.data.email.toLowerCase()}`,
    5,
    15 * 60 * 1000,
  );
  if (!rate.allowed) {
    return NextResponse.json(
      { message: "Đăng nhập quá nhiều lần. Vui lòng thử lại sau." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  let secret = "";
  try {
    secret = getAdminSecret();
  } catch {
    return NextResponse.json(
      { message: "Xác thực admin chưa được cấu hình an toàn." },
      { status: 503 },
    );
  }
  if (!expectedEmail || !expectedPassword || secret.length < 32) {
    return NextResponse.json(
      { message: "Xác thực admin chưa được cấu hình trên máy chủ." },
      { status: 503 },
    );
  }

  if (
    !safeEqual(result.data.email.toLowerCase(), expectedEmail.toLowerCase()) ||
    !safeEqual(result.data.password, expectedPassword)
  ) {
    return NextResponse.json(
      { message: "Email hoặc mật khẩu không đúng." },
      { status: 401 },
    );
  }

  const token = await createAdminToken(expectedEmail, secret);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 8 * 60 * 60,
  });

  return NextResponse.json({ ok: true });
}
