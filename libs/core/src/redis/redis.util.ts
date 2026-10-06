import type { Uuid } from "@libs/contract";

export function jwtidBy(userId: Uuid, sessionId: Uuid) {
  return `user:${userId}:session:${sessionId}`;
}
