const resolveSiteUrl = () => {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production"
      ? "https://example.com"
      : "http://localhost:3107");
  const url = new URL(raw);
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL phải dùng HTTPS trong production.");
  }
  url.pathname = "";
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
};

export const brandConfig = {
  name: "Trà Mộc Sương",
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "Trà Mộc Sương",
  description:
    "Chè đặc sản Thái Nguyên được tuyển chọn theo mùa, kể bằng hồ sơ vùng chè và hướng dẫn pha rõ ràng.",
  siteUrl: resolveSiteUrl(),
  hotline: process.env.NEXT_PUBLIC_HOTLINE ?? "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? "",
  freeShippingThreshold: 600_000,
  policies: {
    shipping: "/chinh-sach-giao-hang",
    returns: "/chinh-sach-doi-tra",
    privacy: "/chinh-sach-bao-mat",
    terms: "/dieu-khoan",
  },
  business: {
    taxCode: process.env.NEXT_PUBLIC_TAX_CODE ?? "",
    license: process.env.NEXT_PUBLIC_BUSINESS_LICENSE ?? "",
  },
} as const;
