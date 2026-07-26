import type { MetadataRoute } from "next";

import { brandConfig } from "@/config/brand";
import { categories, products } from "@/data/products";

const staticPaths = [
  "",
  "/san-pham",
  "/gioi-thieu",
  "/vung-che",
  "/vung-che/tan-cuong",
  "/vung-che/la-bang",
  "/vung-che/trai-cai",
  "/vung-che/khe-coc",
  "/cau-chuyen-nghe-nhan",
  "/huong-dan-pha-tra",
  "/kien-thuc-tra",
  "/kien-thuc-tra/phan-biet-tra-dinh-non-tom-moc-cau",
  "/kien-thuc-tra/pha-tra-xanh-khong-do-nuoc",
  "/kien-thuc-tra/bao-quan-tra",
  "/qua-tang",
  "/bo-suu-tap/hang-ngay",
  "/bo-suu-tap/cao-cap",
  "/bo-suu-tap/qua-bieu",
  "/chinh-sach-giao-hang",
  "/chinh-sach-doi-tra",
  "/chinh-sach-bao-mat",
  "/dieu-khoan",
  "/lien-he",
  "/faq",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPaths.map((path) => ({
      url: `${brandConfig.siteUrl}${path}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...categories.map((category) => ({
      url: `${brandConfig.siteUrl}/danh-muc/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${brandConfig.siteUrl}/san-pham/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
