import { ROLE, SHOP_ROLE, type ShopMember, type User } from "@libs/contract";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, type Loaded, p, wrap } from "@mikro-orm/core";

import { ShopEntity } from "./shop.entity";

export const UserSchema = defineEntity({
  name: AGGREGATE_TYPE.USER,
  properties: useBaseProps({
    email: p.string().unique(),
    password: p.string().lazy().ref().hidden(),
    role: p.enum(ROLE),
    shopRole: p.enum(SHOP_ROLE).nullable(),
    shop: () => p.manyToOne(ShopEntity).nullable().lazyRef().inversedBy("users"),
  }),
});

export class UserEntity extends UserSchema.class {
  toResponse(this: Loaded<UserEntity, "shop">): User {
    const user = wrap(this).serialize({
      exclude: ["shop", "shopRole", "password"],
    });

    return {
      ...user,
      ...this._getMembership(),
    };
  }

  private _getMembership(
    this: Loaded<UserEntity, "shop">,
  ): Pick<ShopMember, "shopId" | "shopRole"> | { shopId: null; shopRole: null } {
    if (!this.shop || !this.shopRole) return { shopId: null, shopRole: null };

    return { shopId: this.shop.id, shopRole: this.shopRole };
  }
}
UserSchema.setClass(UserEntity);
