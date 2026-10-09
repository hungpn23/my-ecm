import { MfaFailure, RecoveryCode, RefreshToken, Totp } from "#internal/database/entity/index";
import { wrap } from "@mikro-orm/core";
import { EntityManager, raw } from "@mikro-orm/postgresql";
import {
  AuthenticationStorage,
  type MfaStore,
  type RefreshTokenRecord,
  type RefreshTokenStore,
  type TotpRecord,
} from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthStore implements RefreshTokenStore, MfaStore {
  constructor(
    private readonly em: EntityManager,
    storage: AuthenticationStorage,
  ) {
    storage.registerSource({ refreshTokens: this, mfa: this });
  }

  private fork() {
    return this.em.fork({
      disableContextResolution: true,
    });
  }

  async getRefreshToken(id: string): Promise<RefreshTokenRecord | undefined> {
    const row = await this.fork().findOne(RefreshToken, { id });
    if (!row) return undefined;

    const { usedAt, claims, ...rest } = wrap(row).serialize({ exclude: ["revoked"] });

    const record: RefreshTokenRecord = rest;
    if (usedAt) record.usedAt = usedAt;
    if (claims) record.claims = claims;

    return record;
  }

  async saveRefreshToken(record: RefreshTokenRecord): Promise<void> {
    const em = this.fork();

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
    const affected = await this.fork().nativeUpdate(
      RefreshToken,
      { id, usedAt: null },
      { usedAt: at },
    );

    return affected === 1;
  }

  async revokeRefreshTokenFamily(familyId: string): Promise<void> {
    await this.fork().nativeUpdate(RefreshToken, { familyId }, { revoked: true });
  }

  async isRefreshTokenFamilyRevoked(familyId: string): Promise<boolean> {
    const count = await this.fork().count(RefreshToken, { familyId, revoked: true });
    return count > 0;
  }

  async revokeUserRefreshTokens(userId: string): Promise<void> {
    await this.fork().nativeUpdate(RefreshToken, { userId }, { revoked: true });
  }

  // TEMPORARY: Required by MfaStore; unused by current application flows.
  async getTotp(userId: string): Promise<TotpRecord | undefined> {
    const row = await this.fork().findOne(Totp, { userId });
    if (!row) return undefined;

    const record: TotpRecord = { secret: row.secret, confirmed: row.confirmed };
    if (row.pendingSecret != null) record.pendingSecret = row.pendingSecret;
    if (row.lastUsedStep != null) record.lastUsedStep = row.lastUsedStep;
    return record;
  }

  // TEMPORARY: Required by MfaStore; unused by current application flows.
  async saveTotp(userId: string, record: TotpRecord | null): Promise<void> {
    const em = this.fork();
    if (!record) {
      await em.nativeDelete(Totp, { userId });
      return;
    }

    const values = {
      secret: record.secret,
      confirmed: record.confirmed,
      pendingSecret: record.pendingSecret ?? null,
    };
    await em
      .createQueryBuilder(Totp)
      .insert({ userId, ...values, lastUsedStep: record.lastUsedStep ?? null })
      .onConflict("userId")
      .merge({
        ...values,
        // A stale save must never reopen a step claimed by another request.
        lastUsedStep: raw('greatest("totp"."last_used_step", excluded."last_used_step")'),
      })
      .execute();
  }

  // TEMPORARY: Required by MfaStore; unused by current application flows.
  async claimTotpStep(userId: string, step: number): Promise<boolean> {
    const affected = await this.fork().nativeUpdate(
      Totp,
      { userId, $or: [{ lastUsedStep: null }, { lastUsedStep: { $lt: step } }] },
      { lastUsedStep: step },
    );
    return affected === 1;
  }

  // TEMPORARY: Required by MfaStore; unused by current application flows.
  async saveRecoveryCodes(userId: string, hashes: string[]): Promise<void> {
    await this.fork().transactional(async (em) => {
      await em.nativeDelete(RecoveryCode, { userId });
      if (hashes.length > 0) {
        await em.insertMany(
          RecoveryCode,
          [...new Set(hashes)].map((codeHash) => ({ userId, codeHash })),
        );
      }
    });
  }

  // TEMPORARY: Required by MfaStore; unused by current application flows.
  async consumeRecoveryCode(userId: string, hash: string): Promise<boolean> {
    const affected = await this.fork().nativeDelete(RecoveryCode, {
      userId,
      codeHash: hash,
    });
    return affected === 1;
  }

  // TEMPORARY: Required by MfaStore; unused by current application flows.
  countRecoveryCodes(userId: string): Promise<number> {
    return this.fork().count(RecoveryCode, { userId });
  }

  // TEMPORARY: Required by MfaStore; unused by current application flows.
  async recordMfaFailure(userId: string, windowMs: number, now: number): Promise<number> {
    // Commit the insert before counting so concurrent guesses see earlier attempts.
    await this.fork().insert(MfaFailure, { userId, failedAt: new Date(now) });
    const failures = await this.countMfaFailures(userId, windowMs, now);
    await this.fork().nativeDelete(MfaFailure, {
      failedAt: { $lte: new Date(now - windowMs) },
    });
    return failures;
  }

  // TEMPORARY: Required by MfaStore; unused by current application flows.
  countMfaFailures(userId: string, windowMs: number, now: number): Promise<number> {
    return this.fork().count(MfaFailure, {
      userId,
      failedAt: { $gt: new Date(now - windowMs) },
    });
  }

  // TEMPORARY: Required by MfaStore; unused by current application flows.
  async clearMfaFailures(userId: string): Promise<void> {
    await this.fork().nativeDelete(MfaFailure, { userId });
  }
}
