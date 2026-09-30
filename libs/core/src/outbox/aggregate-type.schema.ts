import { type } from "arktype";

export const AGGREGATE_TYPE = {
  USER: "User",
  SHOP: "Shop",
  PRODUCT: "Product",
  CATEGORY: "Category",
  OUTBOX: "Outbox",
} as const;
export const AggregateType = type.enumerated(...Object.values(AGGREGATE_TYPE));
export type AggregateType = typeof AggregateType.infer;
