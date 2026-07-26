import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/commerce/product-card";
import { ProductPurchase } from "@/components/commerce/product-purchase";
import { JsonLd } from "@/components/seo/json-ld";
import { brandConfig } from "@/config/brand";
import { products } from "@/data/products";
import { productRepository } from "@/lib/product-repository";

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.getBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/san-pham/${slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0].src],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productRepository.getBySlug(slug);
  if (!product) notFound();
  const related = await productRepository.related(product);
  const lowestPrice = Math.min(
    ...product.variants.map((variant) => variant.price),
  );
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images.map((image) => `${brandConfig.siteUrl}${image.src}`),
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: lowestPrice,
      availability:
        product.stockStatus === "out-of-stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `${brandConfig.siteUrl}/san-pham/${product.slug}`,
    },
  };

  return (
    <>
      <div className="container breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <Link href="/san-pham">Sản phẩm</Link>
        <span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </div>
      <section className="section-compact container product-detail">
        <div className="product-gallery" aria-label="Ảnh sản phẩm">
          {product.images.map((image, index) => (
            <figure key={`${image.src}-${index}`}>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                priority={index === 0}
                loading={index === 0 ? undefined : "eager"}
                sizes="(max-width: 800px) 88vw, 55vw"
              />
            </figure>
          ))}
        </div>
        <ProductPurchase product={product} />
      </section>

      <section className="section soft-panel">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Hồ sơ chén trà</p>
              <h2>Thông tin để bạn dễ chọn.</h2>
            </div>
            <p>
              Vùng nguyên liệu, tiêu chuẩn hái, dáng cánh và cách pha được trình
              bày riêng để bạn so sánh trước khi chọn.
            </p>
          </div>
          <dl className="profile-grid">
            {[
              ["Vùng trồng", product.region],
              ["Vườn chè", product.teaGarden ?? "Không áp dụng"],
              ["Mùa thu hoạch", product.harvestSeason],
              ["Tiêu chuẩn hái", product.pluckingStandard],
              ["Cánh trà", product.dryLeaf],
              ["Hương khô", product.aroma.join(", ")],
              ["Màu nước", product.liquorColor],
              ["Hậu vị", product.aftertaste],
              [
                "Caffeine",
                product.caffeineLevel === "low"
                  ? "Thấp"
                  : product.caffeineLevel === "high"
                    ? "Cao"
                    : "Vừa",
              ],
              ["Bảo quản", product.storageInstructions],
              ["Hạn dùng", product.shelfLife],
              ["Mã sản phẩm", product.sku],
            ].map(([label, value]) => (
              <div className="profile-item" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section container">
        <div className="editorial-split">
          <div className="editorial-image">
            <Image
              src={product.images[1].src}
              alt={product.images[1].alt}
              fill
              sizes="(max-width: 800px) 100vw, 58vw"
            />
          </div>
          <div className="editorial-copy">
            <p className="eyebrow">Câu chuyện sản phẩm</p>
            <h2>{product.grade}, làm để giữ nhịp vị tự nhiên.</h2>
            <p>
              {product.description}{" "}
              {product.category === "tra-cu"
                ? "Dùng nước ấm để vệ sinh, hong thật khô trước khi cất và tránh thay đổi nhiệt độ đột ngột."
                : "Với trà xanh, các công đoạn chính thường gồm làm héo ngắn, diệt men, vò tạo hình, sao khô và phân loại; cách làm cụ thể thay đổi theo từng cơ sở và mẻ trà."}
            </p>
          </div>
        </div>
      </section>

      <section className="section soft-panel">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Hướng dẫn pha</p>
              <h2>Hai cách, cùng một điểm bắt đầu.</h2>
            </div>
            <p>
              Điều chỉnh theo nguồn nước và khẩu vị; nhiệt độ thấp hơn thường
              giúp vị trà xanh dịu hơn.
            </p>
          </div>
          <div className="brewing-grid">
            {product.brewingMethods.map((method) => (
              <article className="brewing-card" key={method.name}>
                <p className="eyebrow">{method.vessel}</p>
                <h3>{method.name}</h3>
                <strong>
                  {method.teaGrams} g · {method.temperatureC}°C
                </strong>
                <p>
                  {method.volumeMl} ml · {method.infusions} lần pha
                </p>
                <p className="muted">{method.steepTimes.join(" / ")}</p>
                <small>{method.note}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ba điều cần nhớ</p>
            <h2>Pha đúng hơn, giữ trà thơm lâu hơn.</h2>
          </div>
          <p>
            Bắt đầu bằng công thức gợi ý, sau đó điều chỉnh theo nguồn nước và
            khẩu vị.
          </p>
        </div>
        <div className="review-grid">
          <article className="review-card">
            <p className="eyebrow">Lượng trà</p>
            <h3>5 g cho ấm 150 ml</h3>
            <p className="muted">
              Giảm lượng trà nếu bạn pha lâu hoặc thích vị nhẹ.
            </p>
          </article>
          <article className="review-card">
            <p className="eyebrow">Nhiệt nước</p>
            <h3>Bắt đầu ở 80–85°C</h3>
            <p className="muted">
              Nước dịu nhiệt thường giúp trà xanh bớt gắt và giữ hương tốt hơn.
            </p>
          </article>
          <article className="review-card">
            <p className="eyebrow">Bảo quản</p>
            <h3>Kín, khô và tránh mùi</h3>
            <p className="muted">
              Đóng kín ngay sau khi lấy trà, tránh ánh sáng và dụng cụ còn ẩm.
            </p>
          </article>
        </div>
      </section>

      <section className="section soft-panel">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Có thể hợp với bạn</p>
              <h2>Sản phẩm liên quan.</h2>
            </div>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={productSchema} />
    </>
  );
}
