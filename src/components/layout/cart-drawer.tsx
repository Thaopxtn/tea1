"use client";

import { useCommerceStore } from "@/store/commerce-store";
import { products } from "@/data/products";
import { useHydrated } from "@/hooks/use-hydrated";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart } = useCommerceStore();
  const hydrated = useHydrated();

  if (!hydrated) return null;

  // Enhance cart items with product details
  const cartItems = cart.map((line) => {
    const product = products.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    return {
      ...line,
      product,
      variant,
    };
  }).filter((item) => item.product && item.variant);

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.variant?.price || 0) * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-slate-900/50 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-serif text-slate-800 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-700" />
                Giỏ Hàng
                <span className="text-sm font-sans font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-1">
                  {cart.length}
                </span>
              </h2>
              <button
                onClick={closeCart}
                className="text-slate-400 hover:text-slate-700 transition-colors p-2 -mr-2 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <ShoppingBag className="w-12 h-12 text-slate-200" />
                  <p>Giỏ hàng của bạn đang trống</p>
                  <button
                    onClick={closeCart}
                    className="mt-4 px-6 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors text-sm font-medium"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 group">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200/50">
                      <Image
                        src={item.product!.images[0].src}
                        alt={item.product!.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-medium text-slate-800 line-clamp-2">
                          <Link href={`/san-pham/${item.product!.slug}`} onClick={closeCart} className="hover:text-green-700 transition-colors">
                            {item.product!.name}
                          </Link>
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-xs text-slate-500 mt-1">{item.variant!.label}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-slate-50 rounded-full px-2 py-1 border border-slate-200/50">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium w-4 text-center select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <p className="font-medium text-slate-800 text-sm">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.variant!.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600">Tổng tạm tính</span>
                  <span className="text-lg font-bold text-slate-800">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Phí vận chuyển sẽ được tính tại trang thanh toán.
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 bg-green-800 text-white py-3.5 rounded-xl font-medium hover:bg-green-900 transition-colors shadow-sm"
                >
                  Thanh Toán Ngay
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
