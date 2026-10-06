import { type } from "arktype";

export const PRODUCT = {
  CREATED: "product.created",
  UPDATED: "product.updated",
} as const;
export const ProductTopic = type.enumerated(...Object.values(PRODUCT));
export type ProductTopic = typeof ProductTopic.infer;
