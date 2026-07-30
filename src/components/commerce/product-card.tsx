import Image from "next/image";
import Link from "next/link";

import { AddToCart } from "@/components/commerce/add-to-cart";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { Price } from "@/components/ui/price";
import { getAvailableVariant, getLowestPrice } from "@/lib/commerce";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const variant = getAvailableVariant(product);
  return (
    <article className="product-card" suppressHydrationWarning>
      <div className="product-media">
        <Link
          href={`/san-pham/${product.slug}`}
          aria-label={`Xem ${product.name}`}
        >
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            width={620}
            height={620}
            sizes="(max-width: 480px) 50vw, (max-width: 900px) 33vw, 25vw"
          />
          <Image
            className="product-image-secondary"
            src={product.images[1].src}
            alt=""
            width={620}
            height={620}
            sizes="(max-width: 900px) 0px, 25vw"
          />
        </Link>
        <div className="product-card-actions">
          <WishlistButton productId={product.id} />
        </div>
        {product.badges[0] ? (
          <span className="badge">{product.badges[0]}</span>
        ) : null}
      </div>
      <div className="product-info">
        <p className="eyebrow">{product.region}</p>
        <h3>
          <Link href={`/san-pham/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-notes">{product.shortDescription}</p>
        <div className="product-buy-row">
          <Price value={getLowestPrice(product)} />
          {variant ? (
            <AddToCart productId={product.id} variantId={variant.id} compact />
          ) : (
            <span className="stock-out">Hết hàng</span>
          )}
        </div>
      </div>
    </article>
  );
}
