# Ví dụ tạo product và xem stock

Chọn environment `env` và chạy các service qua `bun dev` từ root. URL mặc định của Product là `http://localhost:8081/api/v1`, Inventory là `http://localhost:8084/api/v1`; sửa các biến `product` và `inventory` nếu môi trường dùng địa chỉ khác.

1. Đăng nhập bằng request `identity-service/token` với tài khoản thuộc shop. Collection lưu `access_token` sau khi đăng nhập.
2. Tạo category bằng `product-service/create category` hoặc đặt `category_id` thành ID của category đã có.
3. Gọi `product-service/create product`. Request có sẵn ví dụ body với `onHand = 25` và lưu `id` trả về vào `product_id`. Product service gọi RPC tới Inventory để tạo Stock với `onHand` theo request và `reserved = 0`. Response Product có thêm `stock`.
4. Gọi `inventory-service/get stock` bằng tài khoản thuộc shop để xem stock theo `product_id`; response gồm `productId`, `shopId`, `onHand`, `reserved`, `available`, `id`, `createdAt` và `updatedAt`.
5. Gọi `inventory-service/get availability` để xem availability công khai theo `product_id`; response gồm `productId`, `available`, `id`, `createdAt` và `updatedAt`.
6. Gọi `inventory-service/update stock` bằng tài khoản thuộc shop để đổi số lượng tồn. Request mẫu gửi `{ "onHand": 100 }`; response là Stock sau cập nhật. `onHand` không được nhỏ hơn `reserved`, nếu không API trả lỗi `400`.

Với request ví dụ, `stock` trong response tạo Product có dạng:

```json
{
  "onHand": 25,
  "reserved": 0,
  "available": 25
}
```

`onHand` phải là số nguyên không âm, tối đa `2147483647`. `create.stock` là RPC nội bộ, được gọi bởi Product service; không có request HTTP riêng cho RPC này. Nếu RPC lỗi sau khi Product đã được lưu, API tạo Product báo lỗi và Product có thể chưa có Stock.

Ví dụ response của `get stock` (các ID và thời gian chỉ để minh họa):

```json
{
  "id": "01a14957-2ce6-748b-a9cd-394950de72e6",
  "productId": "01a1459b-7e6c-7333-9cea-9040dcc5a5ef",
  "shopId": "01a15f02-f80c-770d-a96c-7b638da81aff",
  "onHand": 25,
  "reserved": 0,
  "available": 25,
  "createdAt": "2026-11-07T10:00:00.000Z",
  "updatedAt": "2026-11-07T10:00:00.000Z"
}
```

Response của `get availability` có cùng `id`, `productId`, `available`, `createdAt` và `updatedAt`.

## Ví dụ checkout và tạo order

Đăng nhập, dùng product đang `ACTIVE` có stock và đặt `address_id` là địa chỉ của tài khoản hiện tại. Chạy lần lượt:

1. `order-service/open checkout`: gửi product, địa chỉ và số lượng; request lưu `checkout_id` từ response.
2. `order-service/process payment`: reserve stock và tạo payment giả lập. Response có `{ "checkout": { ... }, "payment": { ... } }`; request lưu `payment.id` vào `payment_id`.
3. `order-service/confirm checkout`: gửi `{ "paymentId": "{{payment_id}}" }` để xác nhận payment và stock, sau đó tạo order.

Ví dụ response của confirm (ID và thời gian chỉ để minh họa):

```json
{
  "id": "01a1b436-2a2d-7003-a760-15f4f6b53574",
  "checkoutId": "01a14957-2ce6-748b-a9cd-394950de72e6",
  "status": "READY_TO_SHIP",
  "createdAt": "2026-11-07T10:00:00.000Z",
  "updatedAt": "2026-11-07T10:00:00.000Z"
}
```

Payment chỉ được giả lập. Các bước payment, inventory và order chạy ở các service riêng; lỗi giữa các bước có thể để lại trạng thái chưa đồng bộ.
