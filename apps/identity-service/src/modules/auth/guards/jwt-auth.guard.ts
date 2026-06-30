import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PASSPORT_STRATEGIES } from "../constants/passport-strategies";

@Injectable()
export class JwtAuthGuard extends AuthGuard(PASSPORT_STRATEGIES.JWT) {}
