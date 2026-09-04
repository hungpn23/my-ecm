import { PASSPORT_STRATEGY } from "@libs/core";
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class RefreshGuard extends AuthGuard(PASSPORT_STRATEGY.REFRESH) {}
