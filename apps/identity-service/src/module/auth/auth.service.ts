import { User } from "#internal/database/entity/index";
import { Uuid, type AllOrNever, type SuccessResponse } from "@libs/common";
import {
  AuthenticatedSeller,
  isSeller,
  jwtConfig,
  jwtidBy,
  OutboxService,
  RedisService,
  type AuthenticatedUser,
  type JwtConfig,
} from "@libs/core";
import { Transactional } from "@mikro-orm/decorators/legacy";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { hash, verify } from "argon2";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { v7 } from "uuid";
import type { ChangePassword, SignIn, SignUp, TokenResponse } from "./auth.schema";

type GenerateToken = AllOrNever<AuthenticatedSeller, "shopId" | "shopRole"> & {
  userId: Uuid;
  sessionId?: Uuid;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
    @Inject(jwtConfig.KEY)
    private readonly jwtConf: JwtConfig,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    private readonly outboxService: OutboxService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly em: EntityManager,
  ) {}

  @Transactional()
  async signUp({ email, password }: SignUp): Promise<TokenResponse> {
    const user = await this.em.findOne(User, { email });
    if (user) throw new BadRequestException();

    const newUser = this.em.create(User, {
      email,
      password: await hash(password),
    });

    await this.outboxService.createAndFlush({
      aggregateType: "User",
      aggregateId: newUser.id,
      eventType: "user.created",
      payload: { email: newUser.email },
    });

    this.logger.info({ userId: newUser.id, email: newUser.email }, "User created");

    return await this.generateToken({ userId: newUser.id });
  }

  async signIn({ email, password }: SignIn): Promise<TokenResponse> {
    const user = await this.userRepo.findOne({ email });

    if (!user) throw new BadRequestException("Invalid credentials");

    const hashedPassword = await user.password.loadOrFail();
    const isCorrectPassword = await verify(hashedPassword, password);
    if (!isCorrectPassword) throw new BadRequestException("Invalid credentials");

    if (user.shop?.id && user.shopRole) {
      return await this.generateToken({
        userId: user.id,
        shopId: user.shop.id,
        shopRole: user.shopRole,
      });
    }

    return await this.generateToken({ userId: user.id });
  }

  @Transactional()
  async changePassword(
    userId: string,
    { oldPassword, newPassword }: ChangePassword,
  ): Promise<SuccessResponse> {
    const user = await this.userRepo.findOne({ id: userId }, { fields: ["password"] });

    const isCorrectPassword = user && (await verify(user.password.get(), oldPassword));
    if (!isCorrectPassword) throw new BadRequestException("Incorrect password");

    user.password.set(await hash(newPassword));

    return { ok: true };
  }

  async logout({ userId, sessionId }: AuthenticatedUser): Promise<SuccessResponse> {
    const key = jwtidBy(userId, sessionId);
    await this.redisService.delete(key);

    return { ok: true };
  }

  async refreshToken(user: AuthenticatedUser): Promise<TokenResponse> {
    if (isSeller(user)) return await this.generateToken(user);
    return await this.generateToken(user);
  }

  async generateToken(options: GenerateToken): Promise<TokenResponse> {
    const { userId, sessionId = v7(), shopId, shopRole } = options;
    const basePayload = {
      userId,
      sessionId,
    };

    let accessPayload: AuthenticatedUser | AuthenticatedSeller;
    let refreshPayload: AuthenticatedUser | AuthenticatedSeller;

    if (shopId && shopRole) {
      accessPayload = {
        ...basePayload,
        shopId,
        shopRole,
        jwtKind: "ACCESS_TOKEN",
      } satisfies AuthenticatedSeller;

      refreshPayload = {
        ...accessPayload,
        jwtKind: "REFRESH_TOKEN",
      } satisfies AuthenticatedSeller;
    } else {
      accessPayload = {
        ...basePayload,
        jwtKind: "ACCESS_TOKEN",
      } satisfies AuthenticatedUser;

      refreshPayload = {
        ...basePayload,
        jwtKind: "REFRESH_TOKEN",
      } satisfies AuthenticatedUser;
    }

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
