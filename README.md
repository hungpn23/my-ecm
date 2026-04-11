# my-ecm

Repo đã được dọn khỏi `apps/docs`, `apps/web` và các package chỉ phục vụ 2 app đó để chuẩn bị tích hợp app mới, ví dụ TanStack Start.

Hiện repo giữ lại:

- `packages/typescript-config`: cấu hình TypeScript dùng chung
- `turbo`: orchestration task ở cấp monorepo
- `biome`: lint và format ở root

Các lệnh đang có:

```sh
bun run lint
bun run format
bun run check-types
bun run build
```

Khi tạo app TanStack Start mới, bạn có thể thêm lại workspace app mới rồi nối các script/task cần dùng.
