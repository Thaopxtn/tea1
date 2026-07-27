import {
  ArrowRight,
  Droplets,
  Leaf,
  Scale,
  Thermometer,
  Timer,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TeaFinder } from "@/components/home/tea-finder";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { categories } from "@/data/products";

export const metadata: Metadata = {
  title: "Trà Thái Nguyên tuyển theo mùa",
  description:
    "Khám phá Trà Đinh, Trà Nõn Tôm, Trà Móc Câu và các vùng trà tiêu biểu của Thái Nguyên qua thông tin dễ hiểu, hình ảnh nguyên bản và hướng dẫn pha thực tế.",
  alternates: { canonical: "/" },
};

const articles = [
  [
    "phan-biet-tra-dinh-non-tom-moc-cau",
    "Phân biệt Trà Đinh, Trà Nõn Tôm và Trà Móc Câu",
    "Nhìn búp, cánh trà, hương và hậu vị để chọn đúng phẩm trà.",
  ],
  [
    "pha-tra-xanh-khong-do-nuoc",
    "Pha trà xanh không bị đỏ nước",
    "Ba biến số quan trọng: nhiệt độ, thời gian và cách rót cạn.",
  ],
  [
    "bao-quan-tra",
    "Bảo quản trà sau khi mở túi",
    "Giữ hương cốm và hạn chế ẩm, ánh sáng, mùi lạ.",
  ],
];



export default function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <Image
          className="hero-image"
          src="/images/hero-tan-cuong.png"
          alt="Đồi chè xanh trong sương sớm, chiếc giỏ tre nằm giữa những luống chè"
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="hero-content">
          <div className="hero-copy hero-reveal">
            <p className="eyebrow">Tân Cương · Thái Nguyên</p>
            <h1 id="hero-title">
              Gói hương sớm Thái Nguyên trong từng chén trà.
            </h1>
            <p className="hero-description">
              Mỗi phẩm trà được giới thiệu bằng vùng nguyên liệu, dáng cánh, gợi
              ý hương vị và cách pha — đủ rõ để bạn chọn đúng gu của mình.
            </p>
            <div className="hero-actions">
              <Link
                className={buttonVariants({ intent: "primary", size: "lg" })}
                href="/bo-suu-tap/vu-moi"
              >
                Khám phá trà mùa xuân{" "}
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link
                className={buttonVariants({ intent: "secondary", size: "lg" })}
                href="#bo-chon-tra"
              >
                Tìm loại trà phù hợp
              </Link>
            </div>
            <p className="hero-proof">
              24 lựa chọn · 4 vùng trà tiêu biểu · hình ảnh nguyên bản
            </p>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Khám phá theo phẩm trà</p>
            <h2>Nhìn cánh trà, tìm đúng gu.</h2>
          </div>
          <p>
            Trà Đinh, Nõn Tôm và Móc Câu là những cách gọi phẩm trà phổ biến.
            Hãy bắt đầu từ độ đậm, hậu vị và cách bạn thường pha mỗi ngày.
          </p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.slug}
              className="category-tile"
              href={`/danh-muc/${category.slug}`}
            >
              <Image
                src={category.image}
                alt=""
                fill
                sizes="(max-width: 800px) 50vw, 33vw"
              />
              <div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section soft-panel">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Trà nổi bật</p>
              <h2>Những phẩm trà đáng bắt đầu.</h2>
            </div>
            <p>
              So sánh nhanh theo phẩm trà, vùng nguyên liệu và khoảng giá để tìm
              lựa chọn phù hợp cho uống hằng ngày hoặc làm quà.
            </p>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      <section className="section container">
        <div className="editorial-split">
          <div className="editorial-image">
            <Image
              src="/images/nghe-nhan.png"
              alt="Đôi tay nghệ nhân tuyển búp chè xanh trên nia tre"
              fill
              sizes="(max-width: 800px) 100vw, 58vw"
            />
          </div>
          <div className="editorial-copy">
            <p className="eyebrow">Câu chuyện vùng chè</p>
            <h2>Đất đồi, sương sớm và bàn tay sao trà.</h2>
            <p>
              Tân Cương, La Bằng, Trại Cài và Khe Cốc được nhắc đến như bốn vùng
              trà tiêu biểu của Thái Nguyên. Mỗi vùng có điều kiện tự nhiên và
              kinh nghiệm chế biến riêng, tạo nên những sắc thái khác nhau.
            </p>
            <Link className="text-link" href="/vung-che">
              Đi qua các vùng chè <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section id="bo-chon-tra" className="section soft-panel">
        <div className="container">
          <TeaFinder />
        </div>
      </section>

      <section className="section process-showcase">
        <div className="container">
          <div className="section-heading process-heading">
            <div>
              <p className="eyebrow">Từ búp đến chén</p>
              <h2>Bảy bước, một mẻ trà.</h2>
            </div>
            <p>
              Một mẻ trà ngon không đến từ một động tác đơn lẻ. Nó là nhịp nối
              giữa búp non, lửa sao, độ ẩm và kinh nghiệm của người làm trà.
            </p>
          </div>

          <ProcessTimeline />
        </div>
      </section>

      <section className="section soft-panel">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Pha một chén đúng vị</p>
              <h2>Bắt đầu từ những con số dễ nhớ.</h2>
            </div>
            <Link className="text-link" href="/huong-dan-pha-tra">
              Xem hướng dẫn chi tiết →
            </Link>
          </div>
          <div className="brewing-grid">
            {[
              [Scale, "5 g trà", "Cho ấm 150 ml"],
              [Thermometer, "80–85°C", "Nước nguội bớt sau sôi"],
              [Timer, "20 giây", "Lần pha đầu"],
              [Droplets, "4–5 lần", "Tăng dần thời gian"],
              [Leaf, "Ấm gốm", "Giữ nhiệt vừa phải"],
            ].map(([Icon, title, note]) => (
              <div className="brewing-card" key={String(title)}>
                <Icon aria-hidden="true" size={24} />
                <strong>{String(title)}</strong>
                <small>{String(note)}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="editorial-split reverse">
          <div className="editorial-copy">
            <p className="eyebrow">Hộp quà Mộc Sương</p>
            <h2>Một món quà có câu chuyện để kể.</h2>
            <p>
              Chọn phẩm trà, trọng lượng và cách trình bày theo từng dịp: một
              món quà thăm hỏi ấm áp, lời tri ân trang nhã hay bộ quà dành cho
              doanh nghiệp.
            </p>
            <Link
              className={buttonVariants({ intent: "primary", size: "lg" })}
              href="/qua-tang"
            >
              Khám phá hộp quà
            </Link>
          </div>
          <div className="editorial-image">
            <Image
              src="/images/catalog-hop-qua.webp"
              alt="Hộp quà trà màu xanh rêu với hai hộp trà và chén gốm"
              fill
              sizes="(max-width: 800px) 100vw, 58vw"
            />
          </div>
        </div>
      </section>

      <section className="section soft-panel">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Chọn trà theo gu</p>
              <h2>Bắt đầu từ điều bạn muốn cảm nhận.</h2>
            </div>
            <p>
              Không cần thuộc tên phẩm trà. Chỉ cần chọn độ đậm, hoàn cảnh uống
              và kiểu hương bạn yêu thích.
            </p>
          </div>
          <div className="review-grid">
            {[
              [
                "Thanh và êm",
                "Nõn Tôm có cánh thanh, phù hợp khi bạn thích vị chát dịu và hậu ngọt gọn.",
                "Gợi ý: Trà Nõn Tôm Tân Cương",
              ],
              [
                "Đậm vị hằng ngày",
                "Móc Câu thường cho vị rõ hơn, hợp pha ấm hoặc bình lớn trong giờ làm việc.",
                "Gợi ý: Trà Móc Câu Trại Cài",
              ],
              [
                "Trang nhã để tặng",
                "Ưu tiên hộp trình bày gọn, thông tin phẩm trà rõ và trọng lượng phù hợp người nhận.",
                "Gợi ý: Hộp Quà Sương Trên Đồi",
              ],
            ].map(([preference, description, suggestion]) => (
              <article className="review-card" key={preference}>
                <p className="eyebrow">{preference}</p>
                <p>{description}</p>
                <p className="muted">{suggestion}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Kiến thức trà</p>
            <h2>Hiểu để pha ngon hơn.</h2>
          </div>
          <Link className="text-link" href="/kien-thuc-tra">
            Đọc tất cả bài viết →
          </Link>
        </div>
        <div className="article-grid">
          {articles.map(([slug, title, description], index) => (
            <article className="article-card" key={slug}>
              <p className="eyebrow">
                Ghi chép {String(index + 1).padStart(2, "0")}
              </p>
              <h3>{title}</h3>
              <p>{description}</p>
              <Link href={`/kien-thuc-tra/${slug}`}>Đọc bài →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section soft-panel">
        <div className="container editorial-copy">
          <p className="eyebrow">Thư từ đồi trà</p>
          <h2>Nhận một ghi chép ngắn mỗi mùa.</h2>
          <p>
            Ghi chép mùa vụ, cách pha và câu chuyện vùng trà — ngắn gọn, hữu
            ích, tối đa hai thư mỗi tháng.
          </p>
          <a className="text-link" href="#footer-email">
            Đăng ký nhận thư →
          </a>
        </div>
      </section>
    </>
  );
}
