import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { PaymentStatus } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";

const encodeQuery = (entries: Array<[string, string]>) =>
  entries
    .sort(([left], [right]) => left.localeCompare(right))
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value).replaceAll("%20", "+")}`,
    )
    .join("&");

export async function GET(request: Request) {
  const secret = process.env.VNPAY_HASH_SECRET;
  const terminalCode = process.env.VNPAY_TMN_CODE;
  if (!secret || !terminalCode) {
    return NextResponse.json({ RspCode: "99", Message: "Not configured" });
  }

  const url = new URL(request.url);
  const secureHash = url.searchParams.get("vnp_SecureHash") ?? "";
  const entries = [...url.searchParams.entries()].filter(
    ([key]) => key !== "vnp_SecureHash" && key !== "vnp_SecureHashType",
  );
  const expected = createHmac("sha512", secret)
    .update(encodeQuery(entries))
    .digest("hex");
  if (!/^[a-fA-F0-9]{128}$/.test(secureHash)) {
    return NextResponse.json({ RspCode: "97", Message: "Invalid checksum" });
  }
  const expectedBuffer = Buffer.from(expected, "hex");
  const providedBuffer = Buffer.from(secureHash, "hex");
  if (
    expectedBuffer.length !== providedBuffer.length ||
    !timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return NextResponse.json({ RspCode: "97", Message: "Invalid checksum" });
  }

  const orderId = url.searchParams.get("vnp_TxnRef");
  const amount = Number(url.searchParams.get("vnp_Amount"));
  if (!orderId || !Number.isSafeInteger(amount) || amount <= 0) {
    return NextResponse.json({ RspCode: "04", Message: "Invalid data" });
  }
  if (
    url.searchParams.get("vnp_TmnCode") !== terminalCode ||
    url.searchParams.get("vnp_CurrCode") !== "VND"
  ) {
    return NextResponse.json({
      RspCode: "04",
      Message: "Invalid merchant data",
    });
  }

  const db = getDb();
  if (!db)
    return NextResponse.json({ RspCode: "99", Message: "Service unavailable" });
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order)
    return NextResponse.json({ RspCode: "01", Message: "Order not found" });
  if (order.paymentMethod !== "vnpay" || order.total * 100 !== amount) {
    return NextResponse.json({ RspCode: "04", Message: "Order mismatch" });
  }

  const transactionNo = url.searchParams.get("vnp_TransactionNo");
  const responseCode = url.searchParams.get("vnp_ResponseCode") ?? "unknown";
  const externalId =
    transactionNo ||
    `${orderId}:${responseCode}:${url.searchParams.get("vnp_PayDate") ?? "unknown"}`;
  const existing = await db.paymentEvent.findFirst({
    where: { provider: "vnpay", externalId },
  });
  if (existing)
    return NextResponse.json({
      RspCode: "02",
      Message: "Order already confirmed",
    });

  const successful =
    responseCode === "00" &&
    url.searchParams.get("vnp_TransactionStatus") === "00";
  const status = successful ? PaymentStatus.PAID : PaymentStatus.FAILED;
  try {
    await db.$transaction(async (tx) => {
      await tx.paymentEvent.create({
        data: {
          orderId,
          provider: "vnpay",
          externalId,
          status,
          payload: Object.fromEntries(url.searchParams),
        },
      });
      if (order.paymentStatus === PaymentStatus.PENDING) {
        await tx.order.update({
          where: { id: orderId },
          data: { paymentStatus: status },
        });
      }
    });
  } catch {
    return NextResponse.json({ RspCode: "99", Message: "Retry later" });
  }
  return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
}
