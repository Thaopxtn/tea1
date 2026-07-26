"use client";

import { Heart } from "lucide-react";
import clsx from "clsx";

import { track } from "@/lib/analytics";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCommerceStore } from "@/store/commerce-store";

export function WishlistButton({
  productId,
  showLabel = false,
}: {
  productId: string;
  showLabel?: boolean;
}) {
  const hydrated = useHydrated();
  const wishlist = useCommerceStore((state) => state.wishlist);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const selected = hydrated && wishlist.includes(productId);

  return (
    <button
      type="button"
      className={clsx("icon-button wishlist-button", selected && "is-selected")}
      aria-pressed={selected}
      aria-label={selected ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
      onClick={() => {
        toggleWishlist(productId);
        if (!selected) track("add_to_wishlist", { productId });
      }}
    >
      <Heart
        aria-hidden="true"
        size={20}
        fill={selected ? "currentColor" : "none"}
      />
      {showLabel ? (
        <span>{selected ? "Đã yêu thích" : "Yêu thích"}</span>
      ) : null}
    </button>
  );
}
