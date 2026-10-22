import { createHash } from "node:crypto";

import {
  BaseAuth,
  type ChangePassword,
  type RefreshTokenBody,
  type SuccessResponse,
  type TokenResponse,
  Uuid,
} from "@libs/contract";
import { NotificationClient } from "@libs/core";
import { LockMode } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import {
  AuthenticationContext,
  AuthenticationError,
  AuthenticationStorage,
  PasswordHasher,
  RefreshTokenError,
  TokenService,
} from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

import { UserEntity } from "#internal/database/entity/index";

type PasswordProof = { userId: Uuid; passwordHash: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly passwordHasher: PasswordHasher,
    private readonly token: TokenService,
    private readonly storage: AuthenticationStorage,
    private readonly authContext: AuthenticationContext,
    private readonly notificationClient: NotificationClient,
  ) {}

  async signUp({ email, password }: BaseAuth): Promise<TokenResponse> {
    const passwordHash = await this.passwordHasher.hash(password);

    const userId = await this.em.transactional(async (em) => {
      const user = em.create(UserEntity, {
        email,
        password: passwordHash,
        role: "USER",
      });

      await this.notificationClient.emit("user.created", { email: user.email });

      return user.id;
    });

    // pass it directly bc we have nothing to prove yet
    return await this._issueTokens({ userId, passwordHash });
  }

  async signIn({ email, password }: BaseAuth): Promise<TokenResponse> {
    const proof = await this._authenticate({ email }, password);
    const replacementHash = this.passwordHasher.needsRehash(proof.passwordHash)
      ? await this.passwordHasher.hash(password)
      : undefined;

    return await this._issueTokens(proof, replacementHash);
  }

  async changePassword({ oldPassword, newPassword }: ChangePassword): Promise<SuccessResponse> {
    const { id } = this.authContext.requireUser();
    const proof = await this._authenticate({ id }, oldPassword);
    const passwordHash = await this.passwordHasher.hash(newPassword);

    await this.em.transactional(
      async (em) => {
        const lockedUser = await this._lockUserAndVerifyProof(em, proof);
        await this.token.revokeAll(lockedUser.id);
        lockedUser.password.set(passwordHash);
      },
      { clear: true },
    );

    return { ok: true };
  }

  async revokeToken({ refreshToken }: RefreshTokenBody): Promise<SuccessResponse> {
    await this.token.revoke(refreshToken);
    return { ok: true };
  }

  async refreshToken({ refreshToken }: RefreshTokenBody): Promise<TokenResponse> {
    const id = createHash("sha256").update(refreshToken).digest("base64url");
    const record = await this.storage.refreshTokens.getRefreshToken(id);
    if (!Uuid.allows(record?.userId)) throw new RefreshTokenError("invalid");

    const userCount = await this.em.count(UserEntity, { id: record.userId });
    if (!userCount) {
      await this.token.revokeAll(record.userId);
      throw new RefreshTokenError("invalid");
    }

    return this.token.refresh(refreshToken);
  }

  private async _authenticate(where: { email: string } | { id: Uuid }, password: string): Promise<PasswordProof> {
    const user = await this.em.findOne(UserEntity, where, {
      populate: ["password"],
    });
    const passwordHash = user?.password.get();
    const valid = await this.passwordHasher.verify(password, passwordHash);

    if (!valid || !user || !passwordHash) {
      throw new AuthenticationError("Invalid email or password", {
        cause: new Error(!user ? "Unknown user" : "Invalid password"),
      });
    }

    return { userId: user.id, passwordHash };
  }

  private async _lockUserAndVerifyProof(em: EntityManager, proof: PasswordProof) {
    const user = await em.findOne(
      UserEntity,
      { id: proof.userId },
      {
        populate: ["password"],
        lockMode: LockMode.PESSIMISTIC_WRITE,
        refresh: true,
      },
    );

    if (user?.password.get() !== proof.passwordHash) {
      throw new AuthenticationError("Invalid email or password", {
        cause: new Error(
          !user ? `User ${proof.userId} no longer exists` : `Password changed concurrently for user ${proof.userId}`,
        ),
      });
    }

    return user;
  }

  private async _issueTokens(proof: PasswordProof, replacementHash?: string): Promise<TokenResponse> {
    return await this.em.transactional(
      async (em) => {
        const lockedUser = await this._lockUserAndVerifyProof(em, proof);
        if (replacementHash) lockedUser.password.set(replacementHash);

        return await this.token.issue(lockedUser.id, {
          method: "password",
          claims: { amr: ["pwd"] },
        });
      },
      { clear: true },
    );
  }
}
