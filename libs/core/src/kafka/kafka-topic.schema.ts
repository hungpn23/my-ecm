import { type } from "arktype";

export const USER = {
  CREATED: "user.created",
} as const;
export const UserTopic = type.enumerated(...Object.values(USER));
export type UserTopic = typeof UserTopic.infer;

export const PRODUCT = {
  CREATED: "product.created",
} as const;
export const ProductTopic = type.enumerated(...Object.values(PRODUCT));
export type ProductTopic = typeof ProductTopic.infer;

export const KafkaTopics = UserTopic.or(ProductTopic);
export type KafkaTopics = typeof KafkaTopics.infer;
