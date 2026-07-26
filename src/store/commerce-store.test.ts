import { beforeEach, describe, expect, it } from "vitest";

import { useCommerceStore } from "@/store/commerce-store";

describe("commerce store", () => {
  beforeEach(() => {
    useCommerceStore.setState({ cart: [], wishlist: [], orders: [] });
  });

  it("thêm, tăng và xóa sản phẩm", () => {
    const store = useCommerceStore.getState();
    store.addToCart("p-001", "dinh-ngoc-suong-mai-20");
    useCommerceStore.getState().addToCart("p-001", "dinh-ngoc-suong-mai-20", 2);
    expect(useCommerceStore.getState().cart[0].quantity).toBe(3);
    useCommerceStore
      .getState()
      .removeFromCart("p-001", "dinh-ngoc-suong-mai-20");
    expect(useCommerceStore.getState().cart).toHaveLength(0);
  });

  it("bật và tắt yêu thích", () => {
    useCommerceStore.getState().toggleWishlist("p-001");
    expect(useCommerceStore.getState().wishlist).toContain("p-001");
    useCommerceStore.getState().toggleWishlist("p-001");
    expect(useCommerceStore.getState().wishlist).not.toContain("p-001");
  });
});
