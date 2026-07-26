# Dependency audit

Ngày kiểm tra: 2026-07-25.

`npm audit` hiện báo 3 advisory mức `high` trong dependency production của `next@16.2.11`:

- `postcss@8.4.31`: GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q và GHSA-r28c-9q8g-f849.
- `sharp@0.34.5`: GHSA-f88m-g3jw-g9cj.
- Mục `next` được tổng hợp từ hai dependency bắc cầu trên; không có advisory trực tiếp khác được npm liệt kê.

Tại thời điểm kiểm tra, `16.2.11` là bản Next stable mới nhất trên npm. `npm audit fix` đề xuất hạ xuống `next@9.3.3`, là thay đổi major không tương thích với App Router/React hiện tại, nên không được tự động áp dụng.

Phạm vi demo hiện chỉ xử lý CSS tin cậy trong repository và ảnh local, vì vậy không mở endpoint nhận CSS, source map hoặc ảnh tùy ý từ người dùng. Đây chỉ là giảm bề mặt phơi nhiễm, không phải tuyên bố đã loại bỏ lỗ hổng.

Trước production:

1. Theo dõi bản Next stable nâng PostCSS lên trên `8.5.17` và Sharp lên từ `0.35.0`.
2. Nâng Next qua pull request riêng.
3. Chạy lại `npm audit`, lint, typecheck, unit test, E2E và production build.
4. Không dùng `npm audit fix --force` hoặc ép `overrides` framework khi chưa kiểm chứng tương thích.
