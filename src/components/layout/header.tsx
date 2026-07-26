"use client";

import { Dialog } from "@base-ui/react/dialog";

import { ChevronDown, Heart, Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { SearchDialog } from "@/components/layout/search-dialog";
import { brandConfig } from "@/config/brand";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCommerceStore } from "@/store/commerce-store";

const menuGroups = [
  {
    title: "Phẩm trà",
    links: [
      ["Trà Đinh", "/danh-muc/tra-dinh"],
      ["Trà Nõn Tôm", "/danh-muc/non-tom"],
      ["Trà Móc Câu", "/danh-muc/moc-cau"],
      ["Trà Búp", "/danh-muc/tra-bup"],
    ],
  },
  {
    title: "Vùng chè",
    links: [
      ["Tân Cương", "/vung-che/tan-cuong"],
      ["La Bằng", "/vung-che/la-bang"],
      ["Trại Cài", "/vung-che/trai-cai"],
      ["Khe Cốc", "/vung-che/khe-coc"],
    ],
  },
  {
    title: "Theo nhu cầu",
    links: [
      ["Trà dùng hằng ngày", "/bo-suu-tap/hang-ngay"],
      ["Trà cao cấp", "/bo-suu-tap/cao-cap"],
      ["Hộp quà", "/qua-tang"],
      ["Trà cụ", "/danh-muc/tra-cu"],
    ],
  },
  {
    title: "Hiểu về trà",
    links: [
      ["Vùng chè", "/vung-che"],
      ["Cách pha trà", "/huong-dan-pha-tra"],
      ["Kiến thức trà", "/kien-thuc-tra"],
      ["Câu chuyện nghệ nhân", "/cau-chuyen-nghe-nhan"],
    ],
  },
] as const;

export function Header() {
  const [announcement, setAnnouncement] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrated = useHydrated();
  const cartCount = useCommerceStore((state) =>
    state.cart.reduce((total, line) => total + line.quantity, 0),
  );
  const wishCount = useCommerceStore((state) => state.wishlist.length);

  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
    queueMicrotask(() => {
      setAnnouncement(
        localStorage.getItem("moc-suong-announcement") !== "closed",
      );
    });
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenuOpen(false), 500);
  };

  return (
    <>
      {announcement ? (
        <div className="announcement">
          <p>
            Miễn phí giao hàng từ{" "}
            {new Intl.NumberFormat("vi-VN").format(
              brandConfig.freeShippingThreshold,
            )}
            đ · Khám phá bốn vùng trà tiêu biểu
          </p>
          <button
            type="button"
            aria-label="Đóng thông báo"
            onClick={() => {
              localStorage.setItem("moc-suong-announcement", "closed");
              setAnnouncement(false);
            }}
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>
      ) : null}
      <header className="site-header">
        <div className="header-inner">
          <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <Dialog.Trigger
              className="icon-button mobile-menu-trigger"
              aria-label="Mở điều hướng"
            >
              <Menu aria-hidden="true" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="dialog-backdrop" />
              <Dialog.Viewport className="dialog-viewport">
                <Dialog.Popup className="mobile-drawer">
                  <div className="dialog-heading">
                    <Dialog.Title>Điều hướng</Dialog.Title>
                    <Dialog.Description className="sr-only">
                      Danh mục sản phẩm và nội dung Trà Mộc Sương
                    </Dialog.Description>
                    <Dialog.Close
                      className="icon-button"
                      aria-label="Đóng điều hướng"
                    >
                      <X aria-hidden="true" />
                    </Dialog.Close>
                  </div>
                  <nav aria-label="Điều hướng di động">
                    {menuGroups.map((group) => (
                      <details key={group.title}>
                        <summary>
                          {group.title}
                          <ChevronDown aria-hidden="true" size={18} />
                        </summary>
                        <ul>
                          {group.links.map(([label, href]) => (
                            <li key={href}>
                              <Link
                                href={href}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ))}
                    <Link
                      className="drawer-main-link"
                      href="/san-pham"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tất cả sản phẩm
                    </Link>
                  </nav>
                </Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          </Dialog.Root>
          <Link
            href="/"
            className="brand"
            aria-label={`${brandConfig.name} — trang chủ`}
          >
            <span className="brand-mark" aria-hidden="true">
              M
            </span>
            <span>
              <strong>Mộc Sương</strong>
              <small>Trà Thái Nguyên</small>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Điều hướng chính">
            <div
              className="mega-root"
              onMouseEnter={() => {
                cancelClose();
                setMenuOpen(true);
              }}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-controls="mega-menu"
                onClick={() => setMenuOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setMenuOpen(false);
                }}
              >
                Khám phá trà <ChevronDown aria-hidden="true" size={16} />
              </button>
              {menuOpen ? (
                <div
                  id="mega-menu"
                  className="mega-menu"
                  onMouseEnter={cancelClose}
                >
                  <div className="mega-grid">
                    {menuGroups.map((group) => (
                      <div key={group.title}>
                        <p className="eyebrow">{group.title}</p>
                        <ul>
                          {group.links.map(([label, href]) => (
                            <li key={href}>
                              <Link href={href}>{label}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <Link className="mega-feature" href="/vung-che">
                    <span>Bốn vùng trà tiêu biểu</span>
                    <strong>Tân Cương · La Bằng · Trại Cài · Khe Cốc</strong>
                    <small>Khám phá từng vùng →</small>
                  </Link>
                </div>
              ) : null}
            </div>
            <Link href="/san-pham">Sản phẩm</Link>
            <Link href="/qua-tang">Quà biếu</Link>
            <Link href="/kien-thuc-tra">Chuyện trà</Link>
            <Link href="/gioi-thieu">Về Mộc Sương</Link>
          </nav>
          <div className="header-actions">
            <SearchDialog />
            <Link
              className="icon-button count-button hide-small"
              href="/yeu-thich"
              aria-label={`${hydrated ? wishCount : 0} sản phẩm yêu thích`}
            >
              <Heart aria-hidden="true" size={21} />
              {hydrated && wishCount > 0 ? <span>{wishCount}</span> : null}
            </Link>
            <Link
              className="icon-button count-button"
              href="/gio-hang"
              aria-label={`Giỏ hàng có ${hydrated ? cartCount : 0} sản phẩm`}
            >
              <ShoppingBag aria-hidden="true" size={21} />
              {hydrated && cartCount > 0 ? <span>{cartCount}</span> : null}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
