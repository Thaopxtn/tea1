import { NextResponse } from "next/server";
import { z } from "zod";

import { UserRole, UserStatus } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import {
  isSameOrigin,
  readJsonBody,
  RequestValidationError,
} from "@/lib/server/request-security";

const userSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  segment: z.enum(["Khách mới", "Khách thân thiết", "Đại lý", "Admin"]),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { message: "Yêu cầu không được phép." },
      { status: 403 },
    );
  }
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Chưa xác thực." }, { status: 401 });
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
  const result = userSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: "Dữ liệu chưa hợp lệ." },
      { status: 400 },
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { message: "Database chưa được cấu hình." },
      { status: 503 },
    );
  }

  try {
    const user = await db.user.create({
      data: {
        ...result.data,
        email: result.data.email.toLowerCase(),
        role:
          result.data.segment === "Admin" ? UserRole.ADMIN : UserRole.CUSTOMER,
        status: UserStatus.PENDING_VERIFICATION,
      },
    });
    return NextResponse.json({ ok: true, id: user.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Không thể tạo người dùng; email có thể đã tồn tại." },
      { status: 409 },
    );
  }
}
