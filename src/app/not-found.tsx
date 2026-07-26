import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="content-page empty-state">
      <p className="eyebrow">404 · Lạc giữa đồi trà</p>
      <h1>Đường này chưa có dấu chân.</h1>
      <p>Trang bạn tìm không tồn tại hoặc đã được chuyển sang một lối khác.</p>
      <Link
        className={buttonVariants({ intent: "primary", size: "lg" })}
        href="/"
      >
        Trở về trang chủ
      </Link>
    </section>
  );
}
