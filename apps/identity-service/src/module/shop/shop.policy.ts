import type { User } from "@libs/contract";
import { isSeller } from "@libs/core";
import { Policy } from "@nestjs/authorization";

@Policy()
export class ShopPolicy {
  create(user: User | null) {
    return !isSeller(user);
  }
}
