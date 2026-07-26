import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { brandConfig } from "@/config/brand";
import { PaymentStatus } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";
import { createMomoUrl, createVnpayUrl } from "@/lib/payments";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import {
  getClientKey,
  isSameOrigin,
  readJsonBody,
  RequestValidationError,
} from "@/lib/server/request-security";

const paymentSchema = z.object({
  provider: z.enum(["vnpay", "momo"]),
  orderId: z.string().min(6).max(100),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { message: "Yêu cầu không được phép." },
      { status: 403 },
    );
  const rate = consumeRateLimit(
    `payment:${getClientKey(request)}`,
    15,
    10 * 60 * 1000,
  );
  if (!rate.allowed)
    return NextResponse.json(
      { message: "Quá nhiều yêu cầu thanh toán." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );

  let body: unknown;
  try {
    body = await readJsonBody(request, 16 * 1024);
  } catch (error) {
    const message =
      error instanceof RequestValidationError
        ? error.message
        : "Yêu cầu không hợp lệ.";
    return NextResponse.json({ message }, { status: 400 });
  }
  const result = paymentSchema.safeParse(body);
  if (!result.success)
    return NextResponse.json(
      { message: "Yêu cầu thanh toán chưa hợp lệ." },
      { status: 400 },
    );
  if (process.env.PAYMENT_MODE !== "live")
    return NextResponse.json(
      { message: "Thanh toán trực tuyến chưa được bật." },
      { status: 503 },
    );

  const db = getDb();
  if (!db)
    return NextResponse.json(
      { message: "Hệ thống thanh toán chưa sẵn sàng." },
      { status: 503 },
    );
  const order = await db.order.findUnique({
    where: { id: result.data.orderId },
  });
  if (!order)
    return NextResponse.json(
      { message: "Không tìm thấy đơn hàng." },
      { status: 404 },
    );
  if (
    order.paymentMethod !== result.data.provider ||
    order.paymentStatus !== PaymentStatus.PENDING
  ) {
    return NextResponse.json(
      { message: "Trạng thái thanh toán không hợp lệ." },
      { status: 409 },
    );
  }

  try {
    const headerStore = await headers();
    const returnUrl = `${brandConfig.siteUrl}/thanh-toan/ket-qua?orderId=${encodeURIComponent(order.id)}`;
    const ipAddress =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
    const checkoutUrl =
      result.data.provider === "vnpay"
        ? createVnpayUrl({
            orderId: order.id,
            amount: order.total,
            returnUrl,
            ipAddress,
          })
        : await createMomoUrl({
            orderId: order.id,
            amount: order.total,
            returnUrl,
            ipAddress,
          });
    return NextResponse.json({ mode: "live", checkoutUrl });
  } catch {
    return NextResponse.json(
      { message: "Không thể khởi tạo thanh toán. Vui lòng thử lại." },
      { status: 502 },
    );
  }
}
