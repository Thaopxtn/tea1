# Production checklist

## Thông tin bắt buộc từ chủ cửa hàng

- [ ] Domain HTTPS chính thức và quyền cấu hình DNS.
- [ ] Tên pháp nhân, mã số thuế, giấy phép, địa chỉ, hotline và email đã xác minh.
- [ ] Tài khoản PostgreSQL production, TLS, backup tự động và quy trình khôi phục.
- [ ] Merchant VNPay/MoMo, URL IPN/return đã đăng ký và giao dịch sandbox đạt.
- [ ] Nhà cung cấp email/webhook, SPF, DKIM và DMARC.
- [ ] Giá, tồn kho, chính sách giao/đổi trả và hồ sơ từng lô trà được phê duyệt.

## Release

- [ ] `npm ci`
- [ ] `npm audit --omit=dev`
- [ ] `npm run format:check`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npx prisma validate`
- [ ] `npm run build`
- [ ] `npm run test:e2e`
- [ ] `npm run db:deploy` hoàn tất trước khi chuyển traffic.
- [ ] Nếu deploy Vercel: preset `Next.js`, build command `npm run build`, output để mặc định, Node.js 22 hoặc 24.

## Xác thực và dữ liệu

- [ ] `ADMIN_AUTH_REQUIRED=true`, `AUTH_SECRET` ngẫu nhiên từ secret manager.
- [ ] `NEXT_PUBLIC_SITE_URL` là domain HTTPS thật, không dùng localhost hoặc HTTP.
- [ ] Mật khẩu admin riêng, dài; bật MFA/OIDC nếu có nhiều người vận hành.
- [ ] Reverse proxy/CDN giới hạn tốc độ login, checkout và webhook ở phạm vi toàn hệ thống.
- [ ] Cookie Secure, HTTPS/HSTS, CSP và security headers được kiểm tra trên domain thật.
- [ ] Log/analytics không chứa địa chỉ, số điện thoại, cookie, token hoặc merchant secret.

## Thanh toán và vận hành

- [ ] Thử create → redirect → IPN → retry IPN → đối soát cho từng cổng.
- [ ] Cảnh báo cho IPN lỗi, payment pending quá hạn, email lỗi và database capacity.
- [ ] Quy trình hủy đơn hoàn tồn kho và hoàn tiền được phê duyệt.
- [ ] Smoke test desktop/mobile sau deploy; theo dõi error rate trước khi tăng traffic.
