import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { PaymentStatus } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";
import { readJsonBody } from "@/lib/server/request-security";

const momoResultSchema = z.object({
  partnerCode: z.string().min(1).max(100),
  orderId: z.string().min(1).max(100),
  requestId: z.string().min(1).max(200),
  amount: z.number().int().positive(),
  orderInfo: z.string().max(500),
  orderType: z.string().max(100).default("momo_wallet"),
  transId: z.number().int(),
  resultCode: z.number().int(),
  message: z.string().max(500),
  payType: z.string().max(100),
  responseTime: z.number().int(),
  extraData: z.string().max(2_000).default(""),
  signature: z.string().regex(/^[a-fA-F0-9]{64}$/),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await readJsonBody(request, 32 * 1024);
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  const result = momoResultSchema.safeParse(body);
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  if (!result.success || !accessKey || !secretKey || !partnerCode) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const data = result.data;
  if (data.partnerCode !== partnerCode) {
    return NextResponse.json({ message: "Invalid partner" }, { status: 400 });
  }
  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${data.amount}`,
    `extraData=${data.extraData}`,
    `message=${data.message}`,
    `orderId=${data.orderId}`,
    `orderInfo=${data.orderInfo}`,
    `orderType=${data.orderType}`,
    `partnerCode=${data.partnerCode}`,
    `payType=${data.payType}`,
    `requestId=${data.requestId}`,
    `responseTime=${data.responseTime}`,
    `resultCode=${data.resultCode}`,
    `transId=${data.transId}`,
  ].join("&");
  const expected = createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const providedBuffer = Buffer.from(data.signature, "hex");
  if (
    expectedBuffer.length !== providedBuffer.length ||
    !timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const db = getDb();
  if (!db)
    return NextResponse.json(
      { message: "Service unavailable" },
      { status: 503 },
    );
  const order = await db.order.findUnique({ where: { id: data.orderId } });
  if (!order)
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  if (order.paymentMethod !== "momo" || order.total !== data.amount) {
    return NextResponse.json({ message: "Order mismatch" }, { status: 409 });
  }

  const externalId = data.transId > 0 ? String(data.transId) : data.requestId;
  const existing = await db.paymentEvent.findFirst({
    where: { provider: "momo", externalId },
  });
  if (existing) return new NextResponse(null, { status: 204 });

  const status =
    data.resultCode === 0 ? PaymentStatus.PAID : PaymentStatus.FAILED;
  try {
    await db.$transaction(async (tx) => {
      await tx.paymentEvent.create({
        data: {
          orderId: order.id,
          provider: "momo",
          externalId,
          status,
          payload: data,
        },
      });
      if (order.paymentStatus === PaymentStatus.PENDING) {
        await tx.order.update({
          where: { id: order.id },
          data: { paymentStatus: status },
        });
      }
    });
  } catch {
    return NextResponse.json({ message: "Retry later" }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
