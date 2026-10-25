import { type } from "arktype";

export const AGGREGATE_TYPE = {
  USER: "User",
  SHOP: "Shop",
  PRODUCT: "Product",
  CATEGORY: "Category",
  ADDRESS: "Address",
  STOCK: "Stock",
  RESERVATION: "Reservation",
  CHECKOUT: "Checkout",
  ORDER: "Order",
  OUTBOX: "Outbox",
} as const;
export const AggregateType = type.enumerated(...Object.values(AGGREGATE_TYPE));
export type AggregateType = typeof AggregateType.infer;
