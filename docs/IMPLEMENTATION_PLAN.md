# Kế hoạch triển khai Trà Mộc Sương

## 1. Phạm vi và nguyên tắc tham khảo

TeaVivre chỉ được tham khảo ở lớp kiến trúc thông tin: điều hướng phân tầng, bộ lọc theo thuộc tính trà, thẻ sản phẩm có tín hiệu tin cậy, trang chi tiết nối liền mua hàng với vùng trồng và cách pha. Trà Mộc Sương dùng nhận diện, nội dung, dữ liệu, bố cục editorial và ảnh nguyên bản; không sử dụng mã, chữ, logo hay ảnh của TeaVivre.

## 2. Sitemap

- Thương mại: `/`, `/san-pham`, `/danh-muc/[slug]`, `/bo-suu-tap/[slug]`, `/san-pham/[slug]`, `/tim-kiem`, `/gio-hang`, `/thanh-toan`, `/yeu-thich`, `/qua-tang`.
- Thương hiệu: `/gioi-thieu`, `/vung-che`, `/vung-che/[slug]`, `/cau-chuyen-nghe-nhan`, `/lien-he`, `/faq`.
- Kiến thức: `/huong-dan-pha-tra`, `/kien-thuc-tra`, `/kien-thuc-tra/[slug]`.
- Tài khoản demo: `/tai-khoan`, `/tai-khoan/dang-nhap`, `/tai-khoan/dang-ky`, `/tai-khoan/don-hang`, `/tai-khoan/dia-chi`.
- Chính sách: `/chinh-sach-giao-hang`, `/chinh-sach-doi-tra`, `/chinh-sach-bao-mat`, `/dieu-khoan`.
- Nội bộ: `/design-system` chỉ hiển thị ở development.

## 3. Component tree

```text
RootLayout
├── AnnouncementBar
├── Header
│   ├── MegaMenu
│   ├── SearchDialog
│   └── MobileNavigation
├── Main
│   ├── HomeSections
│   ├── ProductExplorer
│   │   ├── FilterPanel
│   │   ├── SortSelect
│   │   └── ProductCard
│   ├── ProductDetail
│   │   ├── ProductGallery
│   │   ├── PurchasePanel
│   │   ├── TeaProfile
│   │   └── BrewingGuide
│   ├── Cart / Checkout
│   └── EditorialPage
├── Footer
└── Toaster
```

Server Component là mặc định. Chỉ state commerce, form, dialog, filter tương tác và wizard dùng Client Component.

## 4. Data model và service layer

- `Product`, `ProductVariant`, `ProductImage`, `BrewingMethod` có schema TypeScript đầy đủ.
- Dữ liệu mock nằm ở `src/data`, không nằm trong component.
- `productRepository` cung cấp `list`, `getBySlug`, `search`, `filter`, `related`; UI không biết nguồn dữ liệu.
- Bước kết nối backend sau này chỉ thay repository bằng adapter Supabase, Shopify, Medusa hoặc API riêng.
- Cart, wishlist và đơn demo lưu local storage qua Zustand `persist`.
- Tiền dùng số nguyên VND; mọi phép tính chạy từ variant đã chọn.

## 5. Design tokens

- Màu: `tea-950 #102d25`, `tea-800 #1d4a38`, `tea-600 #357455`, `tea-400 #79a77d`, `cream-50 #fbfaf4`, `cream-100 #f2eedf`, `earth-600 #785b42`, `gold-500 #ad7f29`, `ink-950 #17201c`, `ink-600 #56615b`.
- Font: serif Georgia cho nhan đề giàu cảm xúc; sans system cho UI. Cả hai hỗ trợ tiếng Việt, không tạo request font ngoài.
- Grid: container tối đa 1.440 px; reading width 68ch; spacing theo thang 4/8/12/16/24/32/48/64/96.
- Radius: 6/12/20 px; ảnh dùng 2–16 px theo ngữ cảnh; tránh mọi khối thành card bo tròn giống nhau.
- Shadow chỉ dùng cho lớp nổi: menu, dialog, toast; đường viền màu trà 12% cho cấu trúc.

## 6. Motion map — kết quả `find-animation-opportunities`

| #   | Vị trí                  | Hiện trạng dự kiến             | Mục đích                    | Tần suất       | Chuyển động                                                             |
| --- | ----------------------- | ------------------------------ | --------------------------- | -------------- | ----------------------------------------------------------------------- |
| 1   | Nút và phần tử bấm      | Thiếu phản hồi vật lý          | Feedback                    | Hàng chục/ngày | `transform: scale(.98)`, 140 ms, `--ease-out-ui`                        |
| 2   | Mega menu               | Nội dung xuất hiện rời trigger | Spatial consistency         | Thỉnh thoảng   | opacity + `translateY(-4px)`, 180 ms, origin tại trigger                |
| 3   | Drawer mobile/cart      | Panel xuất hiện tức thì        | Spatial consistency         | Thỉnh thoảng   | `translateX(100%) → 0`, 260 ms, `--ease-drawer`; exit 200 ms            |
| 4   | Thêm vào giỏ/yêu thích  | Đổi trạng thái đột ngột        | State indication            | Thỉnh thoảng   | crossfade/blur tối đa 2 px, 180 ms; icon chỉ opacity/transform          |
| 5   | Hero lần đầu            | Nội dung và ảnh thiếu nhịp     | Explanation                 | Hiếm           | stagger 50 ms, opacity + `translateY(8px)`, 500 ms; không chặn thao tác |
| 6   | Toast/xác nhận đơn demo | Kết quả xuất hiện đột ngột     | Preventing a jarring change | Hiếm           | opacity + `translateY(100%)`, 220 ms; cùng đường vào/ra                 |

Ứng viên bị loại:

- Search mở bằng phím `/`: loại vì thao tác bàn phím tần suất cao.
- Đổi tab sản phẩm: loại vì chức năng đọc/lọc cần tức thời.
- Số tiền chạy số: loại vì dữ liệu cần đọc ổn định.
- Mọi section đều reveal: loại vì trang dài sẽ chậm và phô trương.
- Card nghiêng theo chuột: loại vì trang commerce cần tập trung vào sản phẩm.

Reduced motion bỏ dịch chuyển lớn/parallax, giữ feedback opacity và màu tối đa 120 ms.

## 7. Accessibility checklist

- Skip link; landmarks; heading hierarchy; breadcrumb có nhãn.
- Tất cả form có label, mô tả lỗi và `aria-invalid`.
- Focus-visible tương phản cao; touch target tối thiểu 44 px.
- Menu, dialog, drawer có `aria-expanded`, Escape và focus management.
- Cart có `aria-live`; trạng thái không chỉ dựa vào màu.
- Hình có alt đúng mục đích; ảnh trang trí dùng alt rỗng.
- Contrast token và zoom 200%; reduced motion; không overflow 360 px.

## 8. SEO plan

- Metadata, canonical, Open Graph và Twitter mặc định từ cấu hình thương hiệu.
- Metadata động riêng cho sản phẩm/bài viết/vùng chè.
- `robots.ts`, `sitemap.ts`.
- JSON-LD: Organization + WebSite ở layout; Product/Offer ở PDP; BreadcrumbList, Article và FAQPage ở route phù hợp.
- Không phát `AggregateRating` cho review demo như dữ liệu thật.

## 9. Test plan

- Unit: định dạng VND, variant, cart total, coupon, filter, search, checkout schema, tea finder.
- Component: thêm giỏ, wishlist, form newsletter, selected/disabled/out-of-stock.
- Playwright: home → mega menu → danh mục → filter → PDP → variant → cart → checkout demo.
- Viewport: 360, 390, 430, 768, 1024, 1280, 1440, 1920; assert không horizontal overflow.
- Chạy lint, typecheck, Vitest, build; Playwright khi browser khả dụng.

## 10. Giai đoạn

1. Khảo sát và cài skill.
2. Thiết lập hệ thống thiết kế và layout.
3. Dữ liệu + repository + commerce state.
4. Route commerce.
5. Route nội dung, tài khoản và chính sách.
6. Kiểm thử, accessibility/SEO.
7. `review-animations` → `improve-animations` → audit lại.
