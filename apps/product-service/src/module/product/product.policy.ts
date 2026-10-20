import type { User } from "@libs/contract";
import { isSeller } from "@libs/core";
import { Policy } from "@nestjs/authorization";

@Policy()
export class ProductPolicy {
  view(user: User | null) {
    return isSeller(user);
  }

  viewDetail(user: User | null) {
    return isSeller(user);
  }

  create(user: User | null) {
    return isSeller(user);
  }

  update(user: User | null) {
    return isSeller(user);
  }

  delete(user: User | null) {
    return isSeller(user);
  }
}
