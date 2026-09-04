import { type } from "arktype";
import type { Request } from "express";
import { JWT_KIND } from "./auth.constant";

export const JwtKindSchema = type.enumerated(...Object.values(JWT_KIND));
export type JwtKind = typeof JwtKindSchema.infer;

// standard claims https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
export const JwtPayloadSchema = type({
  "iss?": "string",
  "sub?": "string",
  "aud?": "string | string[]",
  "exp?": "number",
  "nbf?": "number",
  "iat?": "number",
  "jti?": "string",
});
export type JwtPayload = typeof JwtPayloadSchema.infer;

export const AuthenticatedUserSchema = type({
  userId: "string",
  sessionId: "string",
  jwtKind: JwtKindSchema,
}).merge(JwtPayloadSchema);
export type AuthenticatedUser = typeof AuthenticatedUserSchema.infer;
export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};
