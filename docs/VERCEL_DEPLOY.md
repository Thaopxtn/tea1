# Deploy lên Vercel

Tài liệu này dùng cho bước dựng website thật từ GitHub repo `Thaopxtn/tea1`.

## Preset khi import project

- Application/Framework Preset: `Next.js`
- Root Directory: để trống hoặc `./`
- Install Command: để mặc định
- Build Command: `npm run build`
- Output Directory: để mặc định
- Node.js Version: dùng Node.js 22 hoặc 24

Vercel có thể tự nhận diện Next.js từ `package.json`. Không cần tự nhập output `.next`.

## Environment Variables bắt buộc

Nhập các biến này trong Vercel tại `Project Settings -> Environment Variables`.

- `NEXT_PUBLIC_SITE_URL`: domain HTTPS chính thức, ví dụ `https://tramocsuong.vn`.
- `DATABASE_URL`: PostgreSQL production có TLS, ví dụ có `sslmode=require`.
- `ADMIN_AUTH_REQUIRED=true`
- `AUTH_SECRET`: chuỗi ngẫu nhiên tối thiểu 32 ký tự.
- `ADMIN_EMAIL`: email quản trị thật.
- `ADMIN_PASSWORD`: mật khẩu quản trị mạnh, không dùng lại ở nơi khác.
- `NEXT_PUBLIC_LEGAL_NAME`, `NEXT_PUBLIC_HOTLINE`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_BUSINESS_ADDRESS`, `NEXT_PUBLIC_TAX_CODE`, `NEXT_PUBLIC_BUSINESS_LICENSE`: chỉ điền thông tin đã xác minh.
- `PAYMENT_MODE=disabled` khi chưa thanh toán thật; đổi sang `live` sau khi đã kiểm thử sandbox.

Nếu bật thanh toán online, nhập thêm:

- `VNPAY_TMN_CODE`
- `VNPAY_HASH_SECRET`
- `VNPAY_PAYMENT_URL`
- `MOMO_PARTNER_CODE`
- `MOMO_ACCESS_KEY`
- `MOMO_SECRET_KEY`
- `MOMO_PAYMENT_URL`
- `MOMO_IPN_URL`

Nếu dùng webhook email/liên hệ:

- `EMAIL_WEBHOOK_URL`
- `EMAIL_WEBHOOK_TOKEN`

## Database và migration

1. Tạo PostgreSQL production trước khi deploy chính thức.
2. Gắn `DATABASE_URL` vào Vercel cho cả Production và Preview nếu muốn test preview đầy đủ.
3. Sau khi Vercel deploy xong, chạy migration bằng môi trường production:

```bash
npm run db:deploy
```

4. Chỉ seed catalog khi dữ liệu trà, giá và tồn kho đã duyệt:

```bash
npm run db:seed
```

Seed không tạo tài khoản admin mặc định.

## Kiểm tra sau deploy

- Trang chủ, sản phẩm, giỏ hàng, thanh toán COD.
- Trang admin phải yêu cầu đăng nhập.
- API admin chưa đăng nhập phải trả lỗi xác thực.
- `https://domain/robots.txt` và `https://domain/sitemap.xml` trả nội dung đúng.
- Security headers có `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`.
- Canonical và Open Graph dùng đúng domain thật.
- Nếu bật VNPay/MoMo: thử create payment, return, IPN retry và đối soát số tiền.

## Lưu ý an toàn

- Không nhập secret vào GitHub README, issue, commit hoặc chat công khai.
- Không bật `PAYMENT_MODE=live` nếu chưa có merchant production và chưa thử sandbox end-to-end.
- Không dùng database local cho Production.
- Không tắt `ADMIN_AUTH_REQUIRED` trên Production.
- Không dùng domain HTTP cho `NEXT_PUBLIC_SITE_URL`; production bắt buộc HTTPS.
