"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { useCommerceStore } from "@/store/commerce-store";

export function AddToCart({
  productId,
  variantId,
  disabled = false,
  compact = false,
}: {
  productId: string;
  variantId: string;
  disabled?: boolean;
  compact?: boolean;
}) {
  const { addToCart, openCart } = useCommerceStore((state) => state);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(productId, variantId);
    openCart();
    setAdded(true);
    track("add_to_cart", { productId, variantId });
    toast.success("Đã thêm vào giỏ", {
      description: "Sản phẩm đã được lưu vào giỏ hàng trên thiết bị này.",
    });
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Button
      type="button"
      size={compact ? "sm" : "lg"}
      disabled={disabled}
      onClick={handleAdd}
      className="add-button"
      aria-live="polite"
    >
      {added ? (
        <Check aria-hidden="true" size={18} />
      ) : (
        <ShoppingBag aria-hidden="true" size={18} />
      )}
      <span className={added ? "state-confirmed" : undefined}>
        {added ? "Đã thêm" : compact ? "Thêm nhanh" : "Thêm vào giỏ"}
      </span>
    </Button>
  );
}
