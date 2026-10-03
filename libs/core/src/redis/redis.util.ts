import type { Uuid } from "@libs/common";

export function jwtidBy(userId: Uuid, sessionId: Uuid) {
  return `user:${userId}:session:${sessionId}`;
}
