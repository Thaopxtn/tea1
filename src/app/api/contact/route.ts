import { NextResponse } from "next/server";
import { z } from "zod";

import { sendContactRequest } from "@/lib/email";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import {
  getClientKey,
  isSameOrigin,
  readJsonBody,
} from "@/lib/server/request-security";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/),
  message: z.string().trim().min(10).max(2_000),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { message: "Yêu cầu không được phép." },
      { status: 403 },
    );
  const rate = consumeRateLimit(
    `contact:${getClientKey(request)}`,
    5,
    30 * 60 * 1000,
  );
  if (!rate.allowed)
    return NextResponse.json(
      { message: "Bạn đã gửi quá nhiều yêu cầu." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );

  let body: unknown;
  try {
    body = await readJsonBody(request, 16 * 1024);
  } catch {
    return NextResponse.json(
      { message: "Yêu cầu không hợp lệ." },
      { status: 400 },
    );
  }
  const result = schema.safeParse(body);
  if (!result.success)
    return NextResponse.json(
      { message: "Thông tin liên hệ chưa hợp lệ." },
      { status: 400 },
    );

  try {
    const response = await sendContactRequest(result.data);
    if (!response.sent)
      return NextResponse.json(
        { message: "Kênh liên hệ chưa được cấu hình." },
        { status: 503 },
      );
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json(
      { message: "Chưa thể gửi yêu cầu. Vui lòng thử lại sau." },
      { status: 502 },
    );
  }
}
