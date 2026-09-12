import { type } from "arktype";
import type { Request } from "express";
import { JWT_KIND } from "./auth.constant";

export const JwtKind = type.enumerated(...Object.values(JWT_KIND));
export type JwtKind = typeof JwtKind.infer;

// standard claims https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
export const JwtPayload = type({
  "iss?": "string",
  "sub?": "string",
  "aud?": "string | string[]",
  "exp?": "number",
  "nbf?": "number",
  "iat?": "number",
  "jti?": "string",
});
export type JwtPayload = typeof JwtPayload.infer;

export const AuthenticatedUser = type({
  userId: "string",
  sessionId: "string",
  jwtKind: JwtKind,
}).merge(JwtPayload);
export type AuthenticatedUser = typeof AuthenticatedUser.infer;
export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};
