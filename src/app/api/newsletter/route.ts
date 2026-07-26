import { NextResponse } from "next/server";
import { z } from "zod";

import { subscribeNewsletter } from "@/lib/email";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import {
  getClientKey,
  isSameOrigin,
  readJsonBody,
} from "@/lib/server/request-security";

const schema = z.object({ email: z.string().trim().email().max(254) });

export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { message: "Yêu cầu không được phép." },
      { status: 403 },
    );
  const rate = consumeRateLimit(
    `newsletter:${getClientKey(request)}`,
    5,
    60 * 60 * 1000,
  );
  if (!rate.allowed)
    return NextResponse.json(
      { message: "Vui lòng thử lại sau." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );

  let body: unknown;
  try {
    body = await readJsonBody(request, 4 * 1024);
  } catch {
    return NextResponse.json(
      { message: "Email chưa hợp lệ." },
      { status: 400 },
    );
  }
  const result = schema.safeParse(body);
  if (!result.success)
    return NextResponse.json(
      { message: "Email chưa hợp lệ." },
      { status: 400 },
    );

  try {
    const response = await subscribeNewsletter(result.data.email.toLowerCase());
    if (!response.sent)
      return NextResponse.json(
        { message: "Kênh nhận thư chưa được cấu hình." },
        { status: 503 },
      );
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json(
      { message: "Chưa thể đăng ký lúc này." },
      { status: 502 },
    );
  }
}
