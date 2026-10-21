import type { User } from "@libs/contract";
import { isShopMember } from "@libs/core";
import { Policy } from "@nestjs/authorization";

@Policy()
export class ShopPolicy {
  create(actor: User | null) {
    return !isShopMember(actor);
  }
}
