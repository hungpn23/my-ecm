import { type } from "arktype";
import { Uuid } from "../shared/common.schema";

const JWT_KIND = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
  REFRESH_TOKEN: "REFRESH_TOKEN",
} as const;
export const JwtKind = type.enumerated(...Object.values(JWT_KIND));
export type JwtKind = typeof JwtKind.infer;

// standard claims https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
export const JwtPayload = type({
  iss: "string",
  sub: "string",
  aud: "string | string[]",
  exp: "number",
  nbf: "number",
  iat: "number",
  jti: "string",
}).partial();
export type JwtPayload = typeof JwtPayload.infer;

export const ROLE = ["SYSTEM_ADMIN", "USER"] as const;
export const Role = type.enumerated(...ROLE);
export type Role = typeof Role.infer;

export const SHOP_ROLE = ["OWNER", "ADMIN", "STAFF"] as const;
export const ShopRole = type.enumerated(...SHOP_ROLE);
export type ShopRole = typeof ShopRole.infer;

export const AuthenticatedUser = type({
  userId: Uuid,
  role: Role,
  sessionId: Uuid,
  jwtKind: JwtKind,
}).merge(JwtPayload);
export type AuthenticatedUser = typeof AuthenticatedUser.infer;

export const AuthenticatedSeller = AuthenticatedUser.merge({
  shopId: Uuid,
  shopRole: ShopRole,
});
export type AuthenticatedSeller = typeof AuthenticatedSeller.infer;
