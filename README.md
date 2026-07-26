# Trà Mộc Sương

Website thương mại điện tử trà Thái Nguyên xây bằng Next.js 16, React 19, TypeScript, Prisma 7 và PostgreSQL. Mã nguồn có storefront responsive, quản trị được bảo vệ, tạo đơn theo transaction tồn kho, adapter VNPay/MoMo, webhook email, SEO metadata/sitemap và CI.

## Yêu cầu

- Node.js 20.9 trở lên (CI dùng Node.js 24).
- PostgreSQL có TLS cho môi trường production.
- HTTPS và reverse proxy/CDN có rate limit ở biên.

## Chạy local

```bash
npm ci
copy .env.example .env.local
npm run db:generate
npm run dev -- --port 3107
```

Mở `http://localhost:3107`. Tự tạo `AUTH_SECRET`, `ADMIN_EMAIL` và `ADMIN_PASSWORD` trong `.env.local`; repository không chứa tài khoản mặc định.

## Database

```bash
npm run db:deploy
npm run db:seed
```

Seed chỉ đồng bộ catalog, không tạo tài khoản quản trị mặc định. Nếu thiếu `DATABASE_URL`, storefront vẫn có thể hiển thị catalog nhưng API đặt hàng và thao tác admin trả `503` thay vì báo thành công giả.

## Cấu hình production bắt buộc

Sao chép các key trong `.env.example` vào secret manager của nền tảng:

- `NEXT_PUBLIC_SITE_URL`: domain HTTPS chính thức dùng cho canonical, Open Graph, robots và sitemap.
- `DATABASE_URL`: PostgreSQL production với `sslmode=require`.
- `AUTH_SECRET`: chuỗi ngẫu nhiên tối thiểu 32 ký tự; cùng `ADMIN_EMAIL` và mật khẩu riêng mạnh.
- `PAYMENT_MODE=live` chỉ sau khi đã cấu hình và kiểm thử sandbox toàn bộ VNPay/MoMo.
- `EMAIL_WEBHOOK_URL` để gửi xác nhận đơn, liên hệ và đăng ký nhận thư.
- Các biến `NEXT_PUBLIC_LEGAL_*`/liên hệ chỉ điền bằng thông tin doanh nghiệp đã xác minh.

Ứng dụng fail-closed: production không cho bỏ xác thực admin; đơn hàng không được tạo khi thiếu database; thanh toán không dùng số tiền từ client; IPN phải khớp chữ ký, merchant, phương thức, đơn, tiền và idempotency.

## Kiểm tra trước phát hành

```bash
npm audit --omit=dev
npm run format:check
npm run lint
npm run typecheck
npm run test
npx prisma validate
npm run build
npm run test:e2e
```

GitHub Actions chạy lại toàn bộ kiểm tra trên push và pull request. Dependabot kiểm tra npm hàng tuần và GitHub Actions hàng tháng.

## Deploy

1. Tạo PostgreSQL, đặt secret production và chạy `npm run db:deploy`.
2. Chỉ seed catalog đã được duyệt bằng `npm run db:seed`.
3. Build bằng `npm run build`, chạy bằng `npm run start` sau reverse proxy HTTPS.
4. Cấu hình IPN public cho `/api/payments/vnpay/ipn` và `/api/payments/momo/ipn`.
5. Chạy giao dịch sandbox end-to-end, đối soát amount/currency/order và retry IPN.
6. Xác minh canonical, `robots.txt`, `sitemap.xml`, CSP và security headers trên domain thật.

Checklist vận hành chi tiết nằm tại `docs/PRODUCTION_CHECKLIST.md`.
