import { NextResponse } from "next/server";
import { z } from "zod";

import { PaymentStatus, ProductStatus } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import {
  getClientKey,
  isSameOrigin,
  readJsonBody,
  RequestValidationError,
} from "@/lib/server/request-security";
import { calculateShippingFee } from "@/lib/shipping";

const text = (min: number, max: number) => z.string().trim().min(min).max(max);
const orderSchema = z.object({
  customer: z.object({
    fullName: text(2, 100),
    phone: z
      .string()
      .trim()
      .regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/),
    email: z.string().trim().email().max(254).or(z.literal("")),
    province: text(2, 100),
    district: text(2, 100),
    ward: text(2, 100),
    address: text(6, 240),
    note: z.string().trim().max(500).optional(),
  }),
  payment: z.enum(["cod", "vnpay", "momo"]),
  lines: z
    .array(
      z.object({
        productId: z.string().min(1).max(100),
        variantId: z.string().min(1).max(100),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(50),
});

class StockConflictError extends Error {}

const createOrderId = () => {
  const date = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  return `MS-${date}-${crypto.randomUUID().slice(0, 10).toUpperCase()}`;
};

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { message: "Yêu cầu không được phép." },
      { status: 403 },
    );
  }
  const rate = consumeRateLimit(
    `checkout:${getClientKey(request)}`,
    12,
    10 * 60 * 1000,
  );
  if (!rate.allowed) {
    return NextResponse.json(
      { message: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    const message =
      error instanceof RequestValidationError
        ? error.message
        : "Yêu cầu không hợp lệ.";
    return NextResponse.json({ message }, { status: 400 });
  }
  const result = orderSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: "Thông tin đơn hàng chưa hợp lệ." },
      { status: 400 },
    );
  }
  if (result.data.payment !== "cod" && process.env.PAYMENT_MODE !== "live") {
    return NextResponse.json(
      {
        message:
          "Thanh toán trực tuyến chưa được cấu hình. Vui lòng chọn thanh toán khi nhận hàng.",
      },
      { status: 503 },
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { message: "Hệ thống đặt hàng đang bảo trì. Vui lòng thử lại sau." },
      { status: 503 },
    );
  }

  const combinedLines = new Map<
    string,
    { productId: string; variantId: string; quantity: number }
  >();
  for (const line of result.data.lines) {
    const key = `${line.productId}:${line.variantId}`;
    const current = combinedLines.get(key);
    const quantity = (current?.quantity ?? 0) + line.quantity;
    if (quantity > 20) {
      return NextResponse.json(
        { message: "Số lượng sản phẩm vượt quá giới hạn." },
        { status: 400 },
      );
    }
    combinedLines.set(key, { ...line, quantity });
  }

  const orderId = createOrderId();
  try {
    const order = await db.$transaction(
      async (tx) => {
        const items = [];
        for (const line of combinedLines.values()) {
          const variant = await tx.productVariant.findUnique({
            where: { id: line.variantId },
            include: { product: true },
          });
          if (
            !variant ||
            variant.productId !== line.productId ||
            variant.product.status !== ProductStatus.ACTIVE ||
            variant.stock < line.quantity
          ) {
            throw new StockConflictError();
          }
          items.push({
            productId: variant.productId,
            variantId: variant.id,
            name: `${variant.product.name} · ${variant.label}`,
            quantity: line.quantity,
            unitPrice: variant.price,
          });
        }

        for (const item of items) {
          const updated = await tx.productVariant.updateMany({
            where: { id: item.variantId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (updated.count !== 1) throw new StockConflictError();
        }

        const subtotal = items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        );
        const shippingFee = calculateShippingFee(
          subtotal,
          result.data.customer.province,
        );
        const total = subtotal + shippingFee;
        await tx.order.create({
          data: {
            id: orderId,
            customerName: result.data.customer.fullName,
            email: result.data.customer.email || null,
            phone: result.data.customer.phone,
            shippingAddress: {
              province: result.data.customer.province,
              district: result.data.customer.district,
              ward: result.data.customer.ward,
              address: result.data.customer.address,
            },
            paymentMethod: result.data.payment,
            paymentStatus: PaymentStatus.PENDING,
            subtotal,
            shippingFee,
            total,
            note: result.data.customer.note || null,
            items: { create: items },
          },
        });
        return { subtotal, shippingFee, total };
      },
      { isolationLevel: "Serializable" },
    );

    await sendOrderConfirmation({
      orderId,
      email: result.data.customer.email || undefined,
      customerName: result.data.customer.fullName,
      total: order.total,
    }).catch(() => ({ sent: false, mode: "error" as const }));

    return NextResponse.json(
      { orderId, ...order, mode: "database" },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof StockConflictError) {
      return NextResponse.json(
        { message: "Một sản phẩm không còn đủ tồn kho." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { message: "Không thể tạo đơn hàng lúc này. Vui lòng thử lại." },
      { status: 503 },
    );
  }
}
