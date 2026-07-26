# Danh mục thay thế tài sản

Ba ảnh hiện tại được tạo nguyên bản bằng OpenAI ImageGen cho website, không lấy từ TeaVivre. Trước production, thương hiệu nên thay bằng ảnh chụp đã được duyệt quyền sử dụng.

| Tài sản    | File hiện tại                          | Yêu cầu thay thế                                      |
| ---------- | -------------------------------------- | ----------------------------------------------------- |
| Logo       | Chữ “Mộc Sương” trong component Header | Bộ logo SVG chính thức, bản sáng/tối và favicon       |
| Hero       | `/public/images/hero-tan-cuong.png`    | Đồi chè Tân Cương lúc sớm, khung ngang, chừa vùng chữ |
| Vùng chè   | `/public/images/hero-tan-cuong.png`    | Ảnh thực địa kèm thông tin quyền tác giả              |
| Nghệ nhân  | `/public/images/nghe-nhan.png`         | Ảnh nhân vật có giấy đồng ý sử dụng                   |
| Sản phẩm   | `/public/images/tra-still-life.png`    | Mỗi SKU: chính diện, cận lá, bao bì, nước trà         |
| Quy trình  | `/public/images/nghe-nhan.png`         | 7 bước thu hái–đóng gói                               |
| Hộp quà    | `/public/images/tra-still-life.png`    | Các set thực tế, không dùng mockup sai bao bì         |
| Open Graph | `/public/images/hero-tan-cuong.png`    | Ảnh 1200×630 có vùng an toàn cho nhận diện            |

Mọi ảnh sản phẩm được tham chiếu trong dữ liệu `Product.images`; không hard-code trong thẻ sản phẩm.
