import { type } from "arktype";

export const USER = {
  CREATED: "user.created",
  GET: "user.get",
} as const;
export const UserTopic = type.enumerated(...Object.values(USER));
export type UserTopic = typeof UserTopic.infer;
