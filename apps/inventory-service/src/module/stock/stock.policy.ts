import type { NullableUser } from "@libs/contract";
import { isShopMember } from "@libs/core";
import { Policy } from "@nestjs/authorization";

@Policy()
export class StockPolicy {
  view(user: NullableUser): boolean {
    return isShopMember(user);
  }

  update(user: NullableUser): boolean {
    return isShopMember(user);
  }
}
