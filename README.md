# my-ecm

Các lệnh đang có:

```sh
bun dev
bun check:types
```

## Deprecated

Pipeline Kafka + outbox + Debezium đã deprecated. Không dùng cho tích hợp mới.
Các API trong `libs/core/src/kafka`, `libs/core/src/outbox`, entity outbox và script
`register:debezium` được giữ lại để tương thích với triển khai hiện có.
