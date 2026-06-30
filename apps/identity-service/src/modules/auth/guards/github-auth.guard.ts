import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PASSPORT_STRATEGIES } from "../constants/passport-strategies";

@Injectable()
export class GithubAuthGuard extends AuthGuard(PASSPORT_STRATEGIES.GITHUB) {
  constructor() {
    super();
  }
}
