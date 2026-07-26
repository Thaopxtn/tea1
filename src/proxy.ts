import { NextRequest, NextResponse } from "next/server";

import {
  ADMIN_COOKIE,
  getAdminSecret,
  verifyAdminToken,
} from "@/lib/admin-session";

const buildCsp = (nonce: string, hostname: string) => {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  if (
    process.env.NODE_ENV === "production" &&
    hostname !== "localhost" &&
    hostname !== "127.0.0.1"
  ) {
    directives.push("upgrade-insecure-requests");
  }
  return directives.join("; ");
};

export async function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce, request.nextUrl.hostname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  let response: NextResponse;
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const mayBypass =
      process.env.NODE_ENV !== "production" &&
      process.env.ADMIN_AUTH_REQUIRED === "false";
    const session = mayBypass
      ? { role: "ADMIN" as const }
      : await verifyAdminToken(
          request.cookies.get(ADMIN_COOKIE)?.value,
          getAdminSecret(),
        );

    if (!session) {
      const loginUrl = new URL("/dang-nhap-admin", request.url);
      loginUrl.searchParams.set(
        "next",
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
      );
      response = NextResponse.redirect(loginUrl);
    } else {
      response = NextResponse.next({ request: { headers: requestHeaders } });
    }
  } else {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
