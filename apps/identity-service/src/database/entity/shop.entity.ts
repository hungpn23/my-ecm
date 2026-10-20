import type { ShopDetail, Shop } from "@libs/contract";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p, wrap, type Loaded } from "@mikro-orm/core";
// fallow-ignore-next-line circular-dependency
import { UserEntity } from "./user.entity";

export const ShopSchema = defineEntity({
  name: AGGREGATE_TYPE.SHOP,
  properties: useBaseProps({
    name: p.string(),
    description: p.text().nullable().lazy().ref(),
    owner: () => p.oneToOne(UserEntity).lazyRef(),
    users: () => p.oneToMany(UserEntity).mappedBy("shop"),
  }),
});

export class ShopEntity extends ShopSchema.class {
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
