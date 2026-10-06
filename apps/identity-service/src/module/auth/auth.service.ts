import { User } from "#internal/database/entity/index";
import type { AllOrNever } from "@libs/common";
import {
  AuthenticatedSeller,
  Role,
  Uuid,
  type AuthenticatedUser,
  type ChangePassword,
  type SignIn,
  type SignUp,
  type SuccessResponse,
  type TokenResponse,
} from "@libs/contract";
import {
  isSeller,
  jwtConfig,
  jwtidBy,
  OutboxService,
  RedisService,
  type JwtConfig,
} from "@libs/core";
import { Transactional } from "@mikro-orm/decorators/legacy";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { hash } from "argon2";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { v7 } from "uuid";

type GenerateToken = AllOrNever<AuthenticatedSeller, "shopId" | "shopRole"> & {
  userId: Uuid;
  role: Role;
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
      role: "USER",
    });

    await this.outboxService.createAndFlush({
      aggregateType: "User",
      aggregateId: newUser.id,
      eventType: "user.created",
      payload: { email: newUser.email },
    });

    this.logger.info({ userId: newUser.id, email: newUser.email }, "User created");

    return await this.generateToken({ userId: newUser.id, role: newUser.role });
  }

  async signIn({ email, password }: SignIn): Promise<TokenResponse> {
    const user = await this.userRepo.findOne({ email }, { populate: ["password", "shop"] });
    if (!user) throw new BadRequestException("Invalid credentials");

    await user.verifyPassword(password);

    const membership = user.getMembership();
    if (membership) {
      return await this.generateToken({
        userId: user.id,
        role: user.role,
        shopId: membership.shopId,
        shopRole: membership.shopRole,
      });
    }

    return await this.generateToken({ userId: user.id, role: user.role });
  }

  @Transactional()
  async changePassword(
    userId: Uuid,
    { oldPassword, newPassword }: ChangePassword,
  ): Promise<SuccessResponse> {
    const user = await this.userRepo.findOne({ id: userId }, { populate: ["password"] });
    if (!user) throw new BadRequestException("User not found");

    await user.verifyPassword(oldPassword);

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
    const { userId, role, sessionId = v7(), shopId, shopRole } = options;
    const basePayload = {
      userId,
      role,
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
