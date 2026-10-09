import { defineEntity, p } from "@mikro-orm/core";
import type { RefreshTokenRecord } from "@nestjs/authentication";

export const AuthRefreshTokenSchema = defineEntity({
  name: "AuthRefreshToken",
  properties: {
    id: p.text().primary(),
    familyId: p.text().index(),
    userId: p.text().index(),
    createdAt: p.datetime(),
    expiresAt: p.datetime(),
    familyExpiresAt: p.datetime().index(),
    usedAt: p.datetime().nullable(),
    claims: p.json().$type<NonNullable<RefreshTokenRecord["claims"]>>().nullable(),
    revoked: p.boolean().default(false),
  },
});

export class AuthRefreshToken extends AuthRefreshTokenSchema.class {}
AuthRefreshTokenSchema.setClass(AuthRefreshToken);
