import type { Seller, Uuid } from "@libs/contract";
import { AuthenticationContext } from "@nestjs/authentication";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { isSeller } from "./seller.helper";

@Injectable()
export class SellerContext {
  constructor(private readonly authContext: AuthenticationContext) {}

  get seller(): Seller {
    const user = this.authContext.requireUser();
    if (!isSeller(user)) throw new ForbiddenException("User is not a seller");
    return user;
  }

  get shopId(): Uuid {
    return this.seller.shopId;
  }
}
