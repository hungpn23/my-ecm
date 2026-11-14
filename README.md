# my-ecm

Các lệnh đang có:

```sh
bun dev
bun check:types
```

## E2E đăng nhập trên local

Chuẩn bị database và tài khoản test, sau đó chạy `bun dev` từ root. Trong file `.env.test.local` ở root, cấu hình:

```dotenv
E2E_IDENTITY_URL=http://127.0.0.1:3000
E2E_EMAIL=test@example.com
E2E_PASSWORD=replace-with-test-password
```

Thay URL bằng địa chỉ HTTP thực tế của identity service và dùng thông tin tài khoản test. File `.env.test.local` đã được Git bỏ qua. Sau khi service sẵn sàng, chạy từ root:

```sh
bun run test:e2e
```

Test gọi service và database đang chạy; test không khởi động hoặc dọn các dependency. Đăng nhập thành công tạo refresh token trong database test.

## Deprecated

Pipeline Kafka + outbox + Debezium đã deprecated. Không dùng cho tích hợp mới.
Các API trong `libs/core/src/kafka`, `libs/core/src/outbox`, entity outbox và script
`register:debezium` được giữ lại để tương thích với triển khai hiện có.
