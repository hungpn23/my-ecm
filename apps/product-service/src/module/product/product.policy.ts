import type { NullableUser } from "@libs/contract";
import { isShopMember } from "@libs/core";
import { Policy } from "@nestjs/authorization";

@Policy()
export class ProductPolicy {
  view(user: NullableUser): boolean {
    return isShopMember(user);
  }

  viewDetail(user: NullableUser): boolean {
    return isShopMember(user);
  }

  create(user: NullableUser): boolean {
    return isShopMember(user);
  }

  update(user: NullableUser): boolean {
    return isShopMember(user);
  }

  delete(user: NullableUser): boolean {
    return isShopMember(user);
  }
}
