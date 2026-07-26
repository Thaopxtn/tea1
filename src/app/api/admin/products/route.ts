import { NextResponse } from "next/server";
import { z } from "zod";

import { ProductStatus } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import {
  isSameOrigin,
  readJsonBody,
  RequestValidationError,
} from "@/lib/server/request-security";

const createSchema = z.object({
  name: z.string().trim().min(3).max(160),
  sku: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/),
  category: z.string().trim().min(2).max(80),
  region: z.string().trim().min(2).max(120),
  price: z.number().int().min(1_000).max(1_000_000_000),
  stock: z.number().int().min(0).max(1_000_000),
  active: z.boolean(),
});

const patchSchema = z
  .object({
    id: z.string().min(1).max(100),
    stock: z.number().int().min(0).max(1_000_000).optional(),
    active: z.boolean().optional(),
  })
  .refine((value) => value.stock !== undefined || value.active !== undefined);

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);

async function parseRequest(request: Request) {
  try {
    return await readJsonBody(request);
  } catch (error) {
    throw error instanceof RequestValidationError
      ? error
      : new RequestValidationError("Yêu cầu không hợp lệ.");
  }
}

async function authorize(request: Request) {
  if (!isSameOrigin(request)) return 403;
  return (await requireAdmin()) ? 0 : 401;
}

export async function POST(request: Request) {
  const authStatus = await authorize(request);
  if (authStatus)
    return NextResponse.json(
      {
        message:
          authStatus === 403 ? "Yêu cầu không được phép." : "Chưa xác thực.",
      },
      { status: authStatus },
    );

  let body: unknown;
  try {
    body = await parseRequest(request);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Yêu cầu không hợp lệ.",
      },
      { status: 400 },
    );
  }
  const result = createSchema.safeParse(body);
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

  const item = result.data;
  const id = `p-${crypto.randomUUID()}`;
  try {
    await db.product.create({
      data: {
        id,
        slug: `${slugify(item.name)}-${item.sku.toLowerCase()}`,
        sku: item.sku.toUpperCase(),
        name: item.name,
        description: "Thông tin sản phẩm đang được biên tập.",
        category: item.category,
        region: item.region,
        grade: "Đang cập nhật",
        status: item.active ? ProductStatus.ACTIVE : ProductStatus.DRAFT,
        images: [],
        metadata: { source: "admin" },
        variants: {
          create: {
            id: `${id}-default`,
            label: "Gói tiêu chuẩn",
            packaging: "tui-giay",
            price: item.price,
            stock: item.stock,
          },
        },
      },
    });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Không thể tạo sản phẩm; SKU có thể đã tồn tại." },
      { status: 409 },
    );
  }
}

export async function PATCH(request: Request) {
  const authStatus = await authorize(request);
  if (authStatus)
    return NextResponse.json(
      {
        message:
          authStatus === 403 ? "Yêu cầu không được phép." : "Chưa xác thực.",
      },
      { status: authStatus },
    );

  let body: unknown;
  try {
    body = await parseRequest(request);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Yêu cầu không hợp lệ.",
      },
      { status: 400 },
    );
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
    await db.$transaction(async (tx) => {
      if (result.data.active !== undefined) {
        await tx.product.update({
          where: { id: result.data.id },
          data: {
            status: result.data.active
              ? ProductStatus.ACTIVE
              : ProductStatus.DRAFT,
          },
        });
      }
      if (result.data.stock !== undefined) {
        const variant = await tx.productVariant.findFirst({
          where: { productId: result.data.id },
          orderBy: { id: "asc" },
        });
        if (!variant) throw new Error("NOT_FOUND");
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: result.data.stock },
        });
      }
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Không tìm thấy sản phẩm cần cập nhật." },
      { status: 404 },
    );
  }
}
