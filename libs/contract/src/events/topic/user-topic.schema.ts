import { type } from "arktype";

export const USER = ["user.created"] as const;
export const UserTopic = type.enumerated(...USER);
export type UserTopic = typeof UserTopic.infer;
