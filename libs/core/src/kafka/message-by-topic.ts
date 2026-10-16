import { type KafkaTopic, UserCreatedMessage } from "@libs/contract";
import type { Type } from "arktype";

export const MessageByTopic = {
  "user.created": UserCreatedMessage,
} as const satisfies Record<KafkaTopic, Type>;

export type MessageByTopic = {
  [KTopic in KafkaTopic]: (typeof MessageByTopic)[KTopic]["inferIn"];
};
