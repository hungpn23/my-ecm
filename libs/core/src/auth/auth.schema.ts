import { Uuid } from "@libs/common";
import { type } from "arktype";
import type { Request } from "express";

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

export const SHOP_ROLE = ["OWNER", "ADMIN", "STAFF"] as const;
export const ShopRole = type.enumerated(...SHOP_ROLE);
export type ShopRole = typeof ShopRole.infer;

export const AuthenticatedUser = type({
  userId: Uuid,
  sessionId: Uuid,
  jwtKind: JwtKind,
}).merge(JwtPayload);
export type AuthenticatedUser = typeof AuthenticatedUser.infer;

export const AuthenticatedSeller = AuthenticatedUser.merge({
  shopId: Uuid,
  shopRole: ShopRole,
});
export type AuthenticatedSeller = typeof AuthenticatedSeller.infer;

export type AuthenticatedUserRequest<U extends AuthenticatedUser> = Omit<Request, "user"> & {
  user: U;
};

export type AuthenticatedSellerRequest<S extends AuthenticatedSeller> = Omit<Request, "user"> & {
  user: S;
};
