import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

// Hàm tạo mã đơn hàng ngẫu nhiên (VD: MS-8A2F9)
function generateOrderId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MS-${result}`;
}

export async function POST(request: Request) {
  try {
    const prisma = getDb();
    if (!prisma) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    const body = await request.json();
    const { customerName, phone, email, shippingAddress, note, paymentMethod, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Giỏ hàng trống" }, { status: 400 });
    }

    type CartItem = { productId: string; variantId: string; name: string; quantity: number; unitPrice: number };

    const subtotal = items.reduce((acc: number, item: CartItem) => acc + (item.unitPrice * item.quantity), 0);
    const shippingFee = subtotal >= 600000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    const orderId = generateOrderId();

    const order = await prisma.order.create({
      data: {
        id: orderId,
        customerName,
        phone,
        email,
        shippingAddress,
        note,
        paymentMethod,
        paymentStatus: "PENDING",
        status: "NEW",
        subtotal,
        shippingFee,
        total,
        items: {
          create: items.map((item: CartItem) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
