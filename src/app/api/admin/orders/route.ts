import { NextResponse } from "next/server";
import { z } from "zod";

import { OrderStatus } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import {
  isSameOrigin,
  readJsonBody,
  RequestValidationError,
} from "@/lib/server/request-security";

const statusMap = {
  Mới: OrderStatus.NEW,
  "Đang chuẩn bị": OrderStatus.PREPARING,
  "Đã giao": OrderStatus.DELIVERED,
  "Cần gọi lại": OrderStatus.CONFIRMED,
} as const;

const patchSchema = z.object({
  id: z.string().min(1).max(100),
  status: z.enum(["Mới", "Đang chuẩn bị", "Đã giao", "Cần gọi lại"]),
});

export async function PATCH(request: Request) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { message: "Yêu cầu không được phép." },
      { status: 403 },
    );
  if (!(await requireAdmin()))
    return NextResponse.json({ message: "Chưa xác thực." }, { status: 401 });

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
  const result = patchSchema.safeParse(body);
  if (!result.success)
    return NextResponse.json(
      { message: "Dữ liệu chưa hợp lệ." },
      { status: 400 },
    );

  const db = getDb();
  if (!db)
    return NextResponse.json(
      { message: "Database chưa được cấu hình." },
      { status: 503 },
    );

  try {
    await db.order.update({
      where: { id: result.data.id },
      data: { status: statusMap[result.data.status] },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Không tìm thấy đơn hàng." },
      { status: 404 },
    );
  }
}
