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

## Chạy app bằng container

Mỗi app có một image riêng, được tạo từ Dockerfile chung. Bun chạy trực tiếp
TypeScript; image không cần thư mục `dist`. Chạy lệnh từ root repo.

1. Chuẩn bị `.env` ở root và `.env` trong từng app. Tạo `.env.docker` từ
   `.env.docker.example`, sau đó điều chỉnh địa chỉ database, Redis và các
   dependency khác cho mạng container. File này được load cuối cùng và ghi
   đè các biến trùng tên trong hai file trước; không đặt `APP_PORT` trong file
   này để port của app khớp với port được publish.
2. Compose mount public key từ `.tmp/identity-ed25519-public.pem` vào các
   service cần xác thực và private key từ `.tmp/identity-ed25519-private.pem`
   vào identity service. Đảm bảo user `bun` có quyền đọc các file này. Với
   production, cấu hình nguồn key phù hợp với hạ tầng; không đưa key hoặc
   `.env` vào image.
3. Các app và PostgreSQL dùng cùng network. Kết nối các dependency khác vào
   network đó hoặc cấu hình địa chỉ có thể truy cập từ network đó. Compose này
   khởi tạo PostgreSQL; Redis và các dependency khác cần được cấu hình riêng.
   HTTP của mỗi app được publish trên các network interface của host với port
   `APP_PORT` trong
   file `.env` của app; TCP giữa các service không được publish ra host.
   Không đặt `APP_PORT` trong shell hoặc `.env` ở root khi chạy Compose, vì
   biến đó có thể ghi đè port của từng app trong quá trình nội suy.
   Không chạy đồng thời database trong cấu hình này và `compose.local.yml`,
   vì chúng dùng cùng cổng và thư mục dữ liệu.
4. Build và chạy:

   ```sh
   docker compose build
   docker compose up -d
   ```

`APP_HOST` là địa chỉ bind của HTTP và TCP, còn các biến `*_TCP_HOST` là địa
chỉ client dùng để kết nối. Ví dụ container bind `0.0.0.0` và các container
khác kết nối qua tên service. Khi chạy nhiều Compose project, cấu hình network
chung hoặc dùng địa chỉ DNS tương ứng với môi trường triển khai.

Chạy migration như một job riêng, một lần trước rollout; không chạy đồng thời
trong từng replica. Ví dụ lệnh cho identity service:

```sh
docker compose run --rm --no-deps identity-service \
  bun --filter @apps/identity-service migration:up
```

Cần xác minh migration TypeScript và kết nối database trong môi trường thử
nghiệm trước khi áp dụng lên production. Image chứa source và production
dependencies của toàn bộ workspace, chưa được tối ưu theo từng app. Pin image
Bun bằng digest trong pipeline production và kiểm thử image trước khi rollout.
