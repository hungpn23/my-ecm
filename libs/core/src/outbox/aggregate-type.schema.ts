import { type } from "arktype";

export const ENTITY_NAME = {
  USER: "UserEntity",
  SHOP: "ShopEntity",
  PRODUCT: "ProductEntity",
  CATEGORY: "CategoryEntity",
  ADDRESS: "AddressEntity",
  STOCK: "StockEntity",
  RESERVATION: "ReservationEntity",
  CHECKOUT: "CheckoutEntity",
  ORDER: "OrderEntity",
  OUTBOX: "OutboxEntity",
} as const;
export const AggregateType = type.enumerated(...Object.values(ENTITY_NAME));
export type AggregateType = typeof AggregateType.infer;
