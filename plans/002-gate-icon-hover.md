# 002 — Gate hover của nút icon theo con trỏ chính xác

- **Status**: DONE
- **Commit**: unversioned (workspace chưa khởi tạo Git)
- **Severity**: LOW
- **Category**: Accessibility
- **Estimated scope**: 1 file, khoảng 4 dòng CSS

## Problem

Hover nền của icon nằm ngoài media query, nên thiết bị cảm ứng có thể giữ trạng thái hover giả sau tap.

```css
/* src/app/globals.css:286 — current */
.icon-button:hover {
  background: rgb(53 116 85 / 8%);
}
```

## Target

Chỉ bật hover khi thiết bị có hover và con trỏ chính xác:

```css
@media (hover: hover) and (pointer: fine) {
  .icon-button:hover {
    background: rgb(53 116 85 / 8%);
  }
}
```

Press feedback `:active { transform: scale(0.98) }` vẫn hoạt động trên touch trong 160 ms.

## Repo conventions to follow

- `src/app/globals.css:1582` đã có media query `@media (hover: hover) and (pointer: fine)` cho hover ảnh và nút.
- Không tạo media query thứ hai; chuyển selector vào block hiện có.

## Steps

1. Xóa block `.icon-button:hover` ở gần style nền của icon.
2. Thêm cùng block vào media query hover hiện có.

## Boundaries

- Không thay đổi focus-visible hoặc active feedback.
- Không thay đổi màu.
- Không thêm dependency.

## Verification

- **Mechanical**: `rg -n "\\.icon-button:hover" src/app/globals.css` trả về selector nằm trong media query hover.
- **Feel check**: trên desktop hover có nền nhẹ; trong emulation touch không bị giữ nền sau tap; focus bàn phím vẫn có viền vàng.
- **Done when**: hover icon chỉ tồn tại trong pointer-fine media query.
