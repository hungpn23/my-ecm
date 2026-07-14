import { PASSPORT_STRATEGY } from "@libs/core";
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard(PASSPORT_STRATEGY.GOOGLE) {
  constructor() {
    super();
  }
}
