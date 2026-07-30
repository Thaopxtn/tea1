import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(request: Request) {
  try {
    const prisma = getDb();
    if (!prisma) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    // Basic Auth Check
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, metaTitle, metaDescription, featuredImage, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Vui lòng nhập đủ các trường bắt buộc (Tiêu đề, Slug, Nội dung)" }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await prisma.article.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json({ error: "Đường dẫn (Slug) này đã tồn tại, vui lòng chọn tên khác." }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        metaTitle,
        metaDescription,
        featuredImage,
        status: status === "ACTIVE" ? "ACTIVE" : "DRAFT",
        publishedAt: status === "ACTIVE" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo bài viết:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi lưu bài viết." },
      { status: 500 }
    );
  }
}
