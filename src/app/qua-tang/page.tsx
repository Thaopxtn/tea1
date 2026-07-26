import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/commerce/product-card";
import { buttonVariants } from "@/components/ui/button";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Trà quà tặng",
  description:
    "Hộp quà trà Thái Nguyên cho tri ân, gia đình, lễ Tết và doanh nghiệp.",
  alternates: { canonical: "/qua-tang" },
};

export default function GiftPage() {
  const gifts = products.filter(
    (product) =>
      product.category === "hop-qua" || product.collection === "qua-bieu",
  );
  return (
    <>
      <section className="hero gift-hero">
        <Image
          className="hero-image"
          src="/images/catalog-hop-qua.webp"
          alt="Hộp quà trà xanh rêu với hai hộp trà và một chén gốm"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Quà từ đồi trà</p>
            <h1>Một món quà vừa đủ trang trọng.</h1>
            <p className="hero-description">
              Chọn phẩm trà, quy cách và lời nhắn cho gia đình, tri ân hoặc quà
              doanh nghiệp.
            </p>
            <div className="hero-actions">
              <Link
                className={buttonVariants({ intent: "primary", size: "lg" })}
                href="#hop-qua"
              >
                Xem hộp quà
              </Link>
              <Link
                className={buttonVariants({ intent: "secondary", size: "lg" })}
                href="/lien-he"
              >
                Tư vấn số lượng lớn
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section id="hop-qua" className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Chọn quà theo người nhận</p>
            <h2>Trang nhã cho tri ân, gia đình và đối tác.</h2>
          </div>
          <p>
            Chọn trọng lượng, phẩm trà và cách trình bày theo ngân sách. Với số
            lượng lớn, hãy gửi thời gian cần nhận để được tư vấn phù hợp.
          </p>
        </div>
        <div className="product-grid">
          {gifts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
