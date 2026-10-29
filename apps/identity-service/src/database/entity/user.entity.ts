import { ROLES, SHOP_ROLES, type ShopMember, type User } from "@libs/contract";
import { ENTITY_NAME, useBaseProps } from "@libs/core";
import { defineEntity, type Loaded, p, wrap } from "@mikro-orm/core";

// fallow-ignore-next-line circular-dependency
import { AddressEntity } from "./address.entity";
import { ShopEntity } from "./shop.entity";

export const UserSchema = defineEntity({
  name: ENTITY_NAME.USER,
  tableName: "user",
  properties: useBaseProps({
    email: p.string().unique(),
    password: p.string().lazy().ref().hidden(),
    role: p.enum(ROLES),
    shopRole: p.enum(SHOP_ROLES).nullable(),
    shop: () => p.manyToOne(ShopEntity).nullable().lazyRef().inversedBy("users"),
    addresses: () => p.oneToMany(AddressEntity).mappedBy("user"),
  }),
});

export class UserEntity extends UserSchema.class {
  toResponse(this: Loaded<UserEntity, "shop">): User {
    const user = wrap(this).serialize({
      exclude: ["shop", "shopRole", "password", "addresses"],
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
