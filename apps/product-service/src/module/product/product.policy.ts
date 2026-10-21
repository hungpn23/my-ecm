import type { User } from "@libs/contract";
import { isShopMember } from "@libs/core";
import { Policy } from "@nestjs/authorization";

@Policy()
export class ProductPolicy {
  view(user: User | null) {
    return isShopMember(user);
  }

  viewDetail(user: User | null) {
    return isShopMember(user);
  }

  create(user: User | null) {
    return isShopMember(user);
  }

  update(user: User | null) {
    return isShopMember(user);
  }

  delete(user: User | null) {
    return isShopMember(user);
  }
}
