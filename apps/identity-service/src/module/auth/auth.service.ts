import type { SuccessResponse } from "@libs/common";
import {
  JWT_KIND,
  jwtConfig,
  jwtidBy,
  RedisService,
  type AuthenticatedUser,
  type JwtConfig,
} from "@libs/core";
import { EntityRepository } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/generated";
import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@src/database/entity";
import { hash, verify } from "argon2";
import { v7 } from "uuid";
import type { ChangePassword, SignIn, SignUp, TokenResponse } from "./auth.schema";

type CreateTokenPairOptions = {
  userId: string;
  sessionId?: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConf: JwtConfig,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly em: EntityManager,
  ) {}

  async signUp({ email, password }: SignUp): Promise<TokenResponse> {
    let user = await this.userRepo.findOne({ email });
    if (user) throw new BadRequestException();

    user = this.userRepo.create({
      email,
      password: await hash(password),
    });

    await this.em.flush();

    return await this._createTokenPair({ userId: user.id });
  }

  async signIn({ email, password }: SignIn): Promise<TokenResponse> {
    const user = await this.userRepo.findOne({ email }, { fields: ["password"] });

    const isCorrectPassword = user && (await verify(user.password.get(), password));
    if (!isCorrectPassword) throw new BadRequestException("Invalid credentials");

    return await this._createTokenPair({ userId: user.id });
  }

  async changePassword(
    userId: string,
    { oldPassword, newPassword }: ChangePassword,
  ): Promise<SuccessResponse> {
    const user = await this.userRepo.findOne({ id: userId }, { fields: ["password"] });

    const isCorrectPassword = user && (await verify(user.password.get(), oldPassword));
    if (!isCorrectPassword) throw new BadRequestException("Incorrect password");

    user.password.set(await hash(newPassword));
    await this.em.flush();

    return { ok: true };
  }

  async logout({ userId, sessionId }: AuthenticatedUser): Promise<SuccessResponse> {
    const key = jwtidBy(userId, sessionId);
    await this.redisService.delete(key);

    return { ok: true };
  }

  async refreshToken({ userId, sessionId }: AuthenticatedUser): Promise<TokenResponse> {
    return await this._createTokenPair({ userId, sessionId });
  }

  private async _createTokenPair({
    userId,
    sessionId = v7(),
  }: CreateTokenPairOptions): Promise<TokenResponse> {
    const accessPayload: AuthenticatedUser = {
      userId,
      sessionId,
      jwtKind: JWT_KIND.ACCESS_TOKEN,
    };

    const refreshPayload: AuthenticatedUser = {
      ...accessPayload,
      jwtKind: JWT_KIND.REFRESH_TOKEN,
    };

    const jwtid = v7();

    const [accessToken, refreshToken, _] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        expiresIn: this.jwtConf.JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      }),

      this.jwtService.signAsync(refreshPayload, {
        jwtid,
        expiresIn: this.jwtConf.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
      }),

      this.redisService.set(
        jwtidBy(userId, sessionId),
        jwtid,
        this.jwtConf.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
