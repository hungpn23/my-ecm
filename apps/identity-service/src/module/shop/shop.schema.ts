import { TokenResponse } from "#internal/module/auth/auth.schema";
import { EntityResponse, Uuid, Varchar } from "@libs/common";
import { type } from "arktype";

export const CreateShop = type({
  name: Varchar,
  "description?": "string >= 1",
});
export type CreateShop = typeof CreateShop.infer;

const ShopResponse = EntityResponse.merge({
  name: Varchar,
  ownerId: Uuid,
});
export type ShopResponse = typeof ShopResponse.inferIn;

const ShopDetailResponse = ShopResponse.merge({
  description: "string | null",
});
export type ShopDetailResponse = typeof ShopDetailResponse.inferIn;

export const CreateShopResponse = ShopDetailResponse.merge(TokenResponse);
export type CreateShopResponse = typeof CreateShopResponse.inferIn;
