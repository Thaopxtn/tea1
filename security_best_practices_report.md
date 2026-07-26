# Security best-practices report

Ngày đánh giá: 2026-07-26

## Executive summary

Đã rà soát frontend/server Next.js, xác thực admin, API ghi dữ liệu, đơn hàng, thanh toán, SEO headers và chuỗi cung ứng. Các đường ghi quan trọng hiện fail-closed khi thiếu database hoặc secret; không còn phản hồi “thành công demo”. `npm audit` báo 0 lỗ hổng cho cả dependency runtime và dev sau khi pin phiên bản và override transitive đã vá.

Không còn phát hiện Critical/High đã biết trong phạm vi mã nguồn được kiểm tra. Các mục còn lại phụ thuộc hạ tầng và thông tin do chủ hệ thống cung cấp trước khi mở traffic thật.

## Hạng mục đã khắc phục

- **CSP và security headers:** CSP nonce theo từng request, `frame-ancestors 'none'`, `object-src 'none'`, hạn chế origin; HSTS, nosniff, referrer policy, permissions policy và tắt `X-Powered-By` (`src/proxy.ts:9`, `src/proxy.ts:65`, `next.config.ts:3`).
- **Xác thực admin:** production không thể tắt auth; secret tối thiểu 32 ký tự, cookie HTTP-only/Secure/SameSite=Strict, chống CSRF theo Origin và giới hạn đăng nhập (`src/proxy.ts:43`, `src/lib/admin-session.ts:45`, `src/app/api/auth/admin/login/route.ts:34`, `src/app/api/auth/admin/login/route.ts:60`).
- **Phân quyền gần dữ liệu:** layout admin và từng API kiểm tra phiên server-side trước khi đọc/ghi; mutation admin yêu cầu same-origin.
- **Đơn hàng:** validate kích thước/kiểu dữ liệu, giá lấy từ PostgreSQL, sản phẩm phải ACTIVE, trừ tồn kho có điều kiện trong transaction Serializable; thiếu database trả 503 (`src/app/api/orders/route.ts:100`, `src/app/api/orders/route.ts:135`, `src/app/api/orders/route.ts:150`, `src/app/api/orders/route.ts:189`).
- **Thanh toán:** client không được quyết định amount; máy chủ yêu cầu đơn tồn tại, phương thức khớp và trạng thái PENDING (`src/app/api/payments/create/route.ts:55`, `src/app/api/payments/create/route.ts:76`, `src/app/api/payments/create/route.ts:94`).
- **IPN:** kiểm tra chữ ký, merchant, currency, order, phương thức và amount; callback lặp được nhận diện trước khi cập nhật. Database có unique `(provider, externalId)` (`src/app/api/payments/momo/ipn/route.ts:80`, `src/app/api/payments/vnpay/ipn/route.ts:64`, `prisma/schema.prisma:150`).
- **Secret và dữ liệu mẫu:** `.env*` bị ignore trừ `.env.example`; README không còn credential; seed không tạo admin mặc định; log/cache/browser artifact bị loại khỏi phạm vi Git.
- **SEO/an toàn crawler:** sitemap chỉ chứa trang indexable; robots chặn admin, API, checkout, account và trang hệ thống; metadata noindex trên trang riêng tư (`src/app/robots.ts:5`, `src/app/sitemap.ts:6`).
- **Chuỗi cung ứng:** dependency được pin, lockfile cập nhật, CI chạy audit/format/lint/typecheck/test/Prisma/build/E2E và Dependabot định kỳ.

## Rủi ro còn lại trước khi mở traffic

### Medium — rate limit phân tán

Rate limit trong ứng dụng là lớp bảo vệ best-effort theo process. Khi chạy nhiều instance, cần rate limit phân tán tại CDN/reverse proxy cho login, checkout, contact và payment create. Không tin `X-Forwarded-For` nếu proxy không ghi đè header này.

### Medium — vòng đời đơn và hoàn tiền

Cần quy trình nghiệp vụ được phê duyệt cho hủy đơn, hoàn tồn kho, refund/query giao dịch, cảnh báo payment PENDING quá hạn và đối soát hàng ngày. Không tự động hoàn tồn kho chỉ từ redirect trình duyệt.

### Medium — danh tính quản trị

Cơ chế một email/mật khẩu phù hợp giai đoạn vận hành nhỏ. Nếu có nhiều quản trị viên, thay bằng OIDC/Auth.js có MFA, session server-side, audit log và thu hồi phiên.

### Medium — dữ liệu pháp lý và quyền riêng tư

Phải điền pháp nhân, mã số thuế, địa chỉ, hotline, chính sách và thời hạn lưu dữ liệu đã được người có thẩm quyền/pháp lý duyệt. Không phát hành giá, tồn kho, chứng nhận hoặc hồ sơ lô chưa đối soát.

### Low — hạ tầng chưa thể xác minh trong repository

Chưa thể kiểm tra TLS PostgreSQL, backup/restore, WAF/CDN, secret manager, SPF/DKIM/DMARC, merchant live hoặc IPN public vì chưa có quyền và credential production. Các mục này nằm trong `docs/PRODUCTION_CHECKLIST.md`.

## Bằng chứng kiểm tra

- `npm audit`: 0 vulnerability.
- Vitest: 6 file, 13 test passed.
- ESLint: 0 warning/error.
- TypeScript: passed.
- Prisma schema validate/generate: passed.
- Next.js production build: passed, 87 static pages generated plus dynamic routes.
- Playwright production: 4/4 desktop/mobile tests passed; kiểm tra thêm 8 breakpoint không tràn ngang.
- Smoke test: homepage 200, CSP nonce có trong header và HTML, HSTS/nosniff/X-Frame-Options/Permissions-Policy có mặt, `X-Powered-By` vắng; admin redirect 307; admin API thiếu Origin trả 403; robots/sitemap trả 200.
