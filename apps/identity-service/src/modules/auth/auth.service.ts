import { Inject, Injectable } from "@nestjs/common";
import { jwtConfig, type JwtConfig } from "../../config";

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConf: JwtConfig,
  ) {}
}
