import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className="content-page">
      <p className="eyebrow">Chỉ hiển thị trong development</p>
      <h1>Design system.</h1>
      <div className="design-system-grid">
        <section className="design-sample">
          <h2>Màu</h2>
          <div className="swatches">
            {[
              ["tea-950", "var(--tea-950)", "white"],
              ["tea-800", "var(--tea-800)", "white"],
              ["tea-600", "var(--tea-600)", "white"],
              ["tea-400", "var(--tea-400)", "var(--ink-950)"],
              ["cream-50", "var(--cream-50)", "var(--ink-950)"],
              ["cream-100", "var(--cream-100)", "var(--ink-950)"],
              ["earth-600", "var(--earth-600)", "white"],
              ["gold-500", "var(--gold-500)", "var(--ink-950)"],
            ].map(([name, background, color]) => (
              <div key={name} className="swatch" style={{ background, color }}>
                {name}
              </div>
            ))}
          </div>
        </section>
        <section className="design-sample">
          <h2>Nút</h2>
          <div className="hero-actions">
            <Button>Chính</Button>
            <Button intent="secondary">Phụ</Button>
            <Button intent="quiet">Yên lặng</Button>
            <Button disabled>Đã tắt</Button>
          </div>
        </section>
        <section className="design-sample">
          <h2>Commerce</h2>
          <Price value={580000} compareAt={650000} />
          <br />
          <Rating value={4.8} count={42} />
        </section>
        <section className="design-sample">
          <h2>Trạng thái</h2>
          <p>
            <span className="badge-inline">Mùa xuân</span>
            <span className="demo-label">Dữ liệu demo</span>
          </p>
          <p className="stock-out">Hết hàng</p>
        </section>
      </div>
    </div>
  );
}
