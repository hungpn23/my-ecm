import type { Shop, ShopDetail, ShopRole } from "@libs/contract";
import { ENTITY_NAME, useBaseProps } from "@libs/core";
import { defineEntity, type Loaded, p, wrap } from "@mikro-orm/core";

// fallow-ignore-next-line circular-dependency
import { UserEntity } from "./user.entity";

export const ShopSchema = defineEntity({
  name: ENTITY_NAME.SHOP,
  tableName: "shop",
  properties: useBaseProps({
    name: p.string(),
    description: p.text().nullable().lazy().ref(),
    owner: () => p.oneToOne(UserEntity).lazyRef(),
    users: () => p.oneToMany(UserEntity).mappedBy("shop"),
  }),
});

export class ShopEntity extends ShopSchema.class {
  addMember(user: Loaded<UserEntity>, shopRole: ShopRole): void {
    user.shop = this;
    user.shopRole = shopRole;
  }

  toResponse(this: Loaded<ShopEntity, "owner">): Shop {
    const { owner, ...data } = wrap(this).serialize({
      populate: ["owner"],
    });

    return {
      ...data,
      ownerId: owner.id,
    };
  }

  toDetailResponse(this: Loaded<ShopEntity, "description" | "owner">): ShopDetail {
    const { owner, ...data } = wrap(this).serialize({
      populate: ["description", "owner"],
    });

    return {
      ...data,
      ownerId: owner.id,
    };
  }
}
ShopSchema.setClass(ShopEntity);
