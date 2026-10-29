import { type } from "arktype";

export const USER_TOPICS = ["user.created"] as const;
export const UserTopic = type.enumerated(...USER_TOPICS);
export type UserTopic = typeof UserTopic.infer;
