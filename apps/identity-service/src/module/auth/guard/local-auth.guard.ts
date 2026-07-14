import { PASSPORT_STRATEGY } from "@libs/core";
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard(PASSPORT_STRATEGY.LOCAL) {}
