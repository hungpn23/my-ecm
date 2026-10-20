import { RefreshToken } from "#internal/database/entity/index";
import { wrap } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import {
  AuthenticationStorage,
  type RefreshTokenRecord,
  type RefreshTokenStore,
} from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthStore implements RefreshTokenStore {
  constructor(
    private readonly em: EntityManager,
    storage: AuthenticationStorage,
  ) {
    storage.registerSource({ refreshTokens: this });
  }

  private _fork() {
    return this.em.fork({
      disableContextResolution: true,
    });
  }

  async getRefreshToken(id: string): Promise<RefreshTokenRecord | undefined> {
    const row = await this._fork().findOne(RefreshToken, { id });
    if (!row) return undefined;

    const { usedAt, claims, ...rest } = wrap(row).serialize({ exclude: ["revoked"] });

    const record: RefreshTokenRecord = rest;
    if (usedAt) record.usedAt = usedAt;
    if (claims) record.claims = claims;

    return record;
  }

  async saveRefreshToken(record: RefreshTokenRecord): Promise<void> {
    const em = this._fork();

    await em.insert(RefreshToken, {
      ...record,
      usedAt: record.usedAt ?? null,
      claims: record.claims ?? null,
      revoked: false,
    });

    // cleanup expired family tokens
    await em.nativeDelete(RefreshToken, {
      familyExpiresAt: { $lte: record.createdAt },
    });
  }

  async markRefreshTokenUsed(id: string, at: Date): Promise<boolean> {
    const affected = await this._fork().nativeUpdate(
      RefreshToken,
      { id, usedAt: null },
      { usedAt: at },
    );

    return affected === 1;
  }

  async revokeRefreshTokenFamily(familyId: string): Promise<void> {
    await this._fork().nativeUpdate(RefreshToken, { familyId }, { revoked: true });
  }

  async isRefreshTokenFamilyRevoked(familyId: string): Promise<boolean> {
    const count = await this._fork().count(RefreshToken, { familyId, revoked: true });
    return count > 0;
  }

  async revokeUserRefreshTokens(userId: string): Promise<void> {
    await this._fork().nativeUpdate(RefreshToken, { userId }, { revoked: true });
  }
}
