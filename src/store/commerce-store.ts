"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  productId: string;
  variantId: string;
  quantity: number;
};

type DemoOrder = {
  id: string;
  createdAt: string;
  total: number;
};

type CommerceState = {
  cart: CartLine[];
  wishlist: string[];
  orders: DemoOrder[];
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  toggleWishlist: (productId: string) => void;
  saveOrder: (order: DemoOrder) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

export const useCommerceStore = create<CommerceState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      orders: [],
      addToCart: (productId, variantId, quantity = 1) =>
        set((state) => {
          const existing = state.cart.find(
            (line) =>
              line.productId === productId && line.variantId === variantId,
          );
          if (existing) {
            return {
              cart: state.cart.map((line) =>
                line === existing
                  ? {
                      ...line,
                      quantity: Math.min(99, line.quantity + quantity),
                    }
                  : line,
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              { productId, variantId, quantity: Math.max(1, quantity) },
            ],
          };
        }),
      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter(
                  (line) =>
                    line.productId !== productId ||
                    line.variantId !== variantId,
                )
              : state.cart.map((line) =>
                  line.productId === productId && line.variantId === variantId
                    ? { ...line, quantity: Math.min(99, quantity) }
                    : line,
                ),
        })),
      removeFromCart: (productId, variantId) =>
        set((state) => ({
          cart: state.cart.filter(
            (line) =>
              line.productId !== productId || line.variantId !== variantId,
          ),
        })),
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),
      saveOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),
      clearCart: () => set({ cart: [] }),
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: "moc-suong-commerce",
      partialize: ({ cart, wishlist, orders }) => ({ cart, wishlist, orders }),
    },
  ),
);
