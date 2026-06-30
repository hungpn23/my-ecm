import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PASSPORT_STRATEGIES } from "../constants/passport-strategies";

@Injectable()
export class GoogleAuthGuard extends AuthGuard(PASSPORT_STRATEGIES.GOOGLE) {
  constructor() {
    super();
  }
}
