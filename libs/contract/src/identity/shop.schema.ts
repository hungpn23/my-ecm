import { type } from "arktype";

import { EntityResponse } from "../shared/entity-response.schema";
import { NonEmptyString, Uuid, Varchar255 } from "../shared/string.schema";

export const CreateShop = type({
  name: Varchar255,
  "description?": NonEmptyString,
});
export type CreateShop = typeof CreateShop.infer;

const Shop = EntityResponse.merge({
  name: Varchar255,
  ownerId: Uuid,
});
export type Shop = typeof Shop.inferIn;

export const ShopDetail = Shop.merge({
  description: "string | null",
});
export type ShopDetail = typeof ShopDetail.inferIn;
