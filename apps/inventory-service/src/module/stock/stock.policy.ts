import type { User } from "@libs/contract";
import { isShopMember } from "@libs/core";
import { Policy } from "@nestjs/authorization";

@Policy()
export class StockPolicy {
  view(user: User | null): boolean {
    return isShopMember(user);
  }
}
