import { type } from "arktype";
import { NonEmptyString, Uuid, Varchar255 } from "../shared/common.schema";
import { EntityResponse } from "../shared/entity-response.schema";
import { TokenResponse } from "./auth.schema";

export const CreateShop = type({
  name: Varchar255,
  "description?": NonEmptyString,
});
export type CreateShop = typeof CreateShop.infer;

const ShopResponse = EntityResponse.merge({
  name: Varchar255,
  ownerId: Uuid,
});
export type ShopResponse = typeof ShopResponse.inferIn;

const ShopDetailResponse = ShopResponse.merge({
  description: "string | null",
});
export type ShopDetailResponse = typeof ShopDetailResponse.inferIn;

export const CreateShopResponse = ShopDetailResponse.merge(TokenResponse);
export type CreateShopResponse = typeof CreateShopResponse.inferIn;
