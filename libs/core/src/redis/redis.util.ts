export function jwtidBy(userId: string, sessionId: string) {
  return `user:${userId}:session:${sessionId}`;
}
