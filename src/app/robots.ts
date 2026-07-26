import type { MetadataRoute } from "next";

import { brandConfig } from "@/config/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/dang-nhap-admin",
          "/design-system",
          "/gio-hang",
          "/tai-khoan/",
          "/thanh-toan/",
          "/tim-kiem",
          "/yeu-thich",
        ],
      },
    ],
    sitemap: `${brandConfig.siteUrl}/sitemap.xml`,
  };
}
