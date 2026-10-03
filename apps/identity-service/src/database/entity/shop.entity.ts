import type { ShopDetailResponse, ShopResponse } from "#internal/module/shop/shop.schema";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p, wrap, type Loaded } from "@mikro-orm/core";
// fallow-ignore-next-line circular-dependency
import { User } from "./user.entity";

export const ShopSchema = defineEntity({
  name: AGGREGATE_TYPE.SHOP,
  properties: useBaseProps({
    name: p.string(),
    description: p.text().nullable().lazy().ref(),
    owner: () => p.oneToOne(User).lazyRef(),
    users: () => p.oneToMany(User).mappedBy("shop"),
  }),
});

export class Shop extends ShopSchema.class {
  toResponse(this: Loaded<Shop, "owner">): ShopResponse {
    const { owner, ...data } = wrap(this).serialize({
      populate: ["owner"],
    });

    return {
      ...data,
      ownerId: owner.id,
    };
  }

  toDetailResponse(this: Loaded<Shop, "description" | "owner">): ShopDetailResponse {
    const { owner, ...data } = wrap(this).serialize({
      populate: ["description", "owner"],
    });

    return {
      ...data,
      ownerId: owner.id,
    };
  }
}
ShopSchema.setClass(Shop);
