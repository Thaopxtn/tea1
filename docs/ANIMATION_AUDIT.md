# Animation audit

Audit theo `review-animations`, kế hoạch sửa theo `improve-animations`, sau đó quét lại toàn bộ `src`.

## Findings và thay đổi

| Before                                              | After                                                           | Why                                                                                              |
| --------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Mega menu dùng `@keyframes menu-enter` 180 ms       | Transition `opacity` + `transform` 180 ms với `@starting-style` | Transition retarget từ trạng thái hiện tại khi người dùng mở/đóng nhanh; keyframe có thể restart |
| `.icon-button:hover` áp dụng cho mọi thiết bị       | Đặt trong `@media (hover: hover) and (pointer: fine)`           | Touch có thể giữ hover giả sau tap                                                               |
| Các entry dùng `scale(0.98)` + opacity              | Giữ nguyên                                                      | Không có `scale(0)`; chuyển động giữ được hình khối tự nhiên                                     |
| Modal search có `transform-origin: center`          | Giữ nguyên                                                      | Modal không neo vào trigger nên center là origin đúng                                            |
| Hero dùng 500 ms và stagger 50 ms                   | Giữ nguyên, reduced motion hạ còn 1 ms và bỏ transform          | Đây là marketing reveal hiếm; không phải UI lặp lại                                              |
| Drawer dùng transform 260 ms, curve `--ease-drawer` | Giữ nguyên                                                      | Nằm trong ngân sách dialog/drawer 200–500 ms và kể đúng hướng không gian                         |

## Audit vòng hai

- Không có `transition: all` hoặc `transition-all`.
- Không có `ease-in` cho UI.
- Không có `scale(0)`.
- Không transition `width`, `height`, `top`, `left`, `margin` hoặc `padding`.
- Hover chuyển động được gate cho con trỏ chính xác.
- UI thường xuyên dùng 100–280 ms; hero 500 ms có lý do marketing.
- Drawer, dialog và mega menu chỉ animate `transform`/`opacity`; màu/biên dùng transition ngắn.
- `prefers-reduced-motion` loại bỏ dịch chuyển lớn, giữ feedback opacity/màu ngắn.
- Search mở bằng bàn phím không có shortcut animation riêng.

## Verdict

**Approve.** Không còn feel-breaking regression hoặc blocker motion. Phần cần kiểm tra thêm trên thiết bị thật là cảm giác drawer cảm ứng và hover crossfade ảnh sản phẩm; đây là feel-check, không phải lỗi mã.
