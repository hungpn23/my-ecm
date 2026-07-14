import {
  decodeBase64,
  getUserSessionKey,
  type JwtConfig,
  jwtConfig,
  JwtType,
  RedisService,
} from "@libs/core";
import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { hash, verify } from "argon2";
import { v7 } from "uuid";
import { User } from "../../data-access/entities/user.entity";
import { CreateTokenPairOptions } from "./auth.type";
import { RegisterDto } from "./dto/register.dto";

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

  async register({ email, password }: RegisterDto) {
    let user = await this.userRepo.findOne({ email });
    if (user) throw new BadRequestException();

    user = this.userRepo.create({
      email,
      password: await hash(password),
    });

    await this.em.flush();

    return this._createTokenPair({
      userId: user.id,
      sessionId: v7(),
    });
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.userRepo.findOne({ email }, { fields: ["password"] });
    if (!user) return null;

    const isPasswordMatched = await verify(user.password.get(), password);
    if (isPasswordMatched) return user;

    return null;
  }

  async login(userId: string) {
    return await this._createTokenPair({
      userId,
      sessionId: v7(),
    });
  }

  googleLogin(req: any) {
    if (!req.user) {
      return "No user from google";
    }

    return {
      message: "User information from google",
      user: req.user,
    };
  }

  githubLogin(req: any) {
    if (!req.user) {
      return "No user from github";
    }

    return {
      message: "User information from github",
      user: req.user,
    };
  }

  private async _createTokenPair({ userId, sessionId }: CreateTokenPairOptions) {
    const accessPayload: Express.User = {
      userId,
      sessionId,
      jwtType: JwtType.ACCESS_TOKEN,
    };

    const refreshPayload: Express.User = {
      ...accessPayload,
      jwtType: JwtType.REFRESH_TOKEN,
    };

    const signOptions: JwtSignOptions = {
      algorithm: this.jwtConf.JWT_ALGORITHM,
      audience: this.jwtConf.JWT_AUDIENCE,
      issuer: this.jwtConf.JWT_ISSUER,
      privateKey: decodeBase64(this.jwtConf.JWT_PRIVATE_KEY_BASE64),
    };

    const jwtid = v7();

    const [accessToken, refreshToken, _] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        ...signOptions,
        expiresIn: this.jwtConf.JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      }),

      this.jwtService.signAsync(refreshPayload, {
        ...signOptions,
        expiresIn: this.jwtConf.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
        jwtid,
      }),

      this.redisService.setValue(
        getUserSessionKey(userId, sessionId),
        jwtid,
        this.jwtConf.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
