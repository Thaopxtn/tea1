"use client";

import { useCommerceStore } from "@/store/commerce-store";
import { products } from "@/data/products";
import { useHydrated } from "@/hooks/use-hydrated";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cart, clearCart } = useCommerceStore();
  const hydrated = useHydrated();
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    note: "",
    paymentMethod: "COD",
  });

  const cartItems = cart.map((line) => {
    const product = products.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    return { ...line, product, variant };
  }).filter((item) => item.product && item.variant);

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.variant?.price || 0) * item.quantity,
    0
  );
  const shippingFee = subtotal >= 600000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          phone: formData.phone,
          email: formData.email,
          shippingAddress: {
            street: formData.address,
            city: formData.city,
          },
          note: formData.note,
          paymentMethod: formData.paymentMethod,
          items: cartItems.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            name: `${item.product!.name} - ${item.variant!.label}`,
            quantity: item.quantity,
            unitPrice: item.variant!.price,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Có lỗi xảy ra");

      setSuccessOrder(data.orderId);
      clearCart();
      toast.success("Đặt hàng thành công!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) return null;

  if (successOrder) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-serif text-slate-800 mb-4">Cảm ơn bạn!</h1>
          <p className="text-slate-600 mb-6">
            Đơn hàng <strong className="text-slate-800">#{successOrder}</strong> của bạn đã được tiếp nhận. 
            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
          </p>
          <Link href="/" className="inline-block bg-green-800 text-white px-8 py-3 rounded-full font-medium hover:bg-green-900 transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container mx-auto max-w-6xl px-4">
        <Link href="/san-pham" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-green-700 mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Tiếp tục mua sắm
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form */}
          <div className="flex-1">
            <h1 className="text-3xl font-serif text-slate-800 mb-8">Thông tin thanh toán</h1>
            
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Thông tin liên hệ */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-medium text-slate-800 mb-6">Thông tin liên hệ & Giao hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Họ và tên *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all bg-slate-50 focus:bg-white" placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Số điện thoại *</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all bg-slate-50 focus:bg-white" placeholder="09xxxxxxx" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all bg-slate-50 focus:bg-white" placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Địa chỉ cụ thể *</label>
                    <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all bg-slate-50 focus:bg-white" placeholder="Số nhà, tên đường, phường/xã..." />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Tỉnh/Thành phố *</label>
                    <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all bg-slate-50 focus:bg-white" placeholder="Ví dụ: Hà Nội" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Ghi chú đơn hàng (Tùy chọn)</label>
                    <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all bg-slate-50 focus:bg-white min-h-[100px]" placeholder="Yêu cầu riêng về đóng gói, thời gian giao hàng..." />
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-medium text-slate-800 mb-6">Phương thức thanh toán</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${formData.paymentMethod === 'COD' ? 'border-green-600 bg-green-50/50' : 'border-slate-100 hover:border-green-200'}`}>
                    <input type="radio" name="payment" value="COD" checked={formData.paymentMethod === 'COD'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-5 h-5 text-green-600 focus:ring-green-600" />
                    <div>
                      <div className="font-medium text-slate-800">Thanh toán khi nhận hàng (COD)</div>
                      <div className="text-sm text-slate-500">Thanh toán bằng tiền mặt khi đơn hàng được giao đến.</div>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${formData.paymentMethod === 'BANK' ? 'border-green-600 bg-green-50/50' : 'border-slate-100 hover:border-green-200'}`}>
                    <input type="radio" name="payment" value="BANK" checked={formData.paymentMethod === 'BANK'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-5 h-5 text-green-600 focus:ring-green-600" />
                    <div>
                      <div className="font-medium text-slate-800">Chuyển khoản ngân hàng</div>
                      <div className="text-sm text-slate-500">Thông tin tài khoản sẽ hiển thị sau khi đặt hàng.</div>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:w-[420px]">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-xl font-medium text-slate-800 mb-6">Đơn hàng của bạn</h2>
              
              {cartItems.length === 0 ? (
                <div className="text-center py-6 text-slate-500">Giỏ hàng trống</div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                        <div className="relative w-16 h-16 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.product!.images[0].src} alt={item.product!.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-sm font-medium text-slate-800 line-clamp-1">{item.product!.name}</h3>
                          <p className="text-xs text-slate-500">{item.variant!.label}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-slate-600">SL: {item.quantity}</span>
                            <span className="text-sm font-medium text-slate-800">
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.variant!.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 mt-6 pt-6 space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Tạm tính</span>
                      <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Phí vận chuyển</span>
                      <span>{shippingFee === 0 ? "Miễn phí" : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shippingFee)}</span>
                    </div>
                    <div className="border-t border-dashed border-slate-200 mt-4 pt-4 flex justify-between items-center">
                      <span className="font-medium text-slate-800">Tổng cộng</span>
                      <span className="text-2xl font-bold text-green-700">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={loading || cartItems.length === 0}
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-green-800 text-white py-4 rounded-xl font-medium hover:bg-green-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                  >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {loading ? "Đang xử lý..." : "Đặt Hàng Ngay"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
