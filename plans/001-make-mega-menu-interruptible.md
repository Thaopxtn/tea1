# 001 — Làm chuyển động mega menu có thể retarget

- **Status**: DONE
- **Commit**: unversioned (workspace chưa khởi tạo Git)
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 1 file, khoảng 12 dòng CSS

## Problem

Mega menu là bề mặt có thể mở lại nhanh bằng hover/click nhưng đang dùng keyframe. Keyframe khởi động lại từ đầu khi thao tác bị đảo nhanh, thay vì retarget từ trạng thái hiện tại.

```css
/* src/app/globals.css:416 — current */
.mega-menu {
  transform-origin: 190px top;
  animation: menu-enter 180ms var(--ease-out-ui);
}

@keyframes menu-enter {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
}
```

## Target

Dùng transition cho `opacity` và `transform`, duration 180 ms trong ngân sách dropdown 150–250 ms, curve chính xác `--ease-out-ui: cubic-bezier(0.23, 1, 0.32, 1)`. Entry dùng `@starting-style`; không dùng `scale(0)`.

```css
.mega-menu {
  opacity: 1;
  transform: translateY(0) scale(1);
  transform-origin: 190px top;
  transition:
    opacity 180ms var(--ease-out-ui),
    transform 180ms var(--ease-out-ui);
}

@starting-style {
  .mega-menu {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
}
```

## Repo conventions to follow

- Motion token nằm ở `src/app/globals.css:22–28`.
- Dialog ở `src/app/globals.css:529–538` đã transition riêng `opacity` và `transform` bằng `--ease-out-ui`.

## Steps

1. Trong `src/app/globals.css`, thay `animation: menu-enter…` bằng trạng thái settled và hai transition cụ thể.
2. Xóa toàn bộ `@keyframes menu-enter`.
3. Thêm `@starting-style` ngay sau `.mega-menu`.

## Boundaries

- Không đổi markup hoặc logic đóng/mở menu.
- Không sửa duration của dialog/drawer.
- Không thêm dependency.
- Nếu selector hoặc token không còn tồn tại, dừng và báo drift.

## Verification

- **Mechanical**: `npm run typecheck`, `npm run lint`, `npm run build` đều thành công; `rg "@keyframes menu-enter" src` không có kết quả.
- **Feel check**: mở/đóng menu nhanh bằng chuột và click; kiểm tra entry không bật lại từ `scale(0)`; DevTools 10% xác nhận origin ở trigger; reduced motion bỏ dịch chuyển nhưng giữ opacity ngắn.
- **Done when**: menu vào từ trigger trong 180 ms, không còn keyframe và không có blocker motion.
