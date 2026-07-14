export function getUserSessionKey(userId: string, sessionId: string) {
  return `user:${userId}:session:${sessionId}`;
}
