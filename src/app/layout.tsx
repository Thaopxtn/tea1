import type { Metadata } from "next";
import { Toaster } from "sonner";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MotionExperience } from "@/components/layout/motion-experience";
import { JsonLd } from "@/components/seo/json-ld";
import { brandConfig } from "@/config/brand";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/lora/500.css";
import "@fontsource/lora/600.css";
import "@fontsource/lora/700.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(brandConfig.siteUrl),
  title: {
    default: `${brandConfig.name} — Chè đặc sản Thái Nguyên`,
    template: `%s · ${brandConfig.name}`,
  },
  description: brandConfig.description,
  applicationName: brandConfig.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: brandConfig.name,
    title: `${brandConfig.name} — Chè đặc sản Thái Nguyên`,
    description: brandConfig.description,
    images: [
      {
        url: "/images/hero-tan-cuong.png",
        width: 1824,
        height: 898,
        alt: "Đồi chè Thái Nguyên trong sương sớm",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: brandConfig.name,
    description: brandConfig.description,
    images: ["/images/hero-tan-cuong.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@type": "Organization",
    name: brandConfig.legalName,
    url: brandConfig.siteUrl,
    ...(brandConfig.email ? { email: brandConfig.email } : {}),
    ...(brandConfig.hotline ? { telephone: brandConfig.hotline } : {}),
    ...(brandConfig.address ? { address: brandConfig.address } : {}),
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        name: brandConfig.name,
        url: brandConfig.siteUrl,
        inLanguage: "vi-VN",
        potentialAction: {
          "@type": "SearchAction",
          target: `${brandConfig.siteUrl}/tim-kiem?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="vi">
      <body>
        <MotionExperience />
        <a className="skip-link" href="#noi-dung-chinh">
          Bỏ qua điều hướng
        </a>
        <Header />
        <main id="noi-dung-chinh">{children}</main>
        <Footer />
        <Toaster className="toast-root" richColors position="bottom-right" />
        <JsonLd data={structuredData} />
      </body>
    </html>
  );
}
