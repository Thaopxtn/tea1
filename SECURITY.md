# Chính sách bảo mật

Không công khai lỗ hổng trong issue. Hãy gửi mô tả, ảnh hưởng, bước tái hiện và phiên bản/commit liên quan qua kênh bảo mật riêng của chủ repository. Không gửi secret, thông tin thanh toán hoặc dữ liệu khách hàng trong báo cáo.

## Phạm vi hỗ trợ

Chỉ nhánh `main` mới nhất được hỗ trợ. Bản vá bảo mật được ưu tiên theo mức ảnh hưởng và sẽ được phát hành sau khi kiểm thử hồi quy.

## Nguyên tắc vận hành

- Secret chỉ được lưu trong secret manager của nền tảng triển khai.
- PostgreSQL production phải dùng TLS, backup và tài khoản quyền tối thiểu.
- Callback thanh toán phải dùng HTTPS và không được bỏ qua bước đối soát IPN.
- Không đưa `.env.local`, log, ảnh chụp dữ liệu thật hoặc file export khách hàng vào Git.
