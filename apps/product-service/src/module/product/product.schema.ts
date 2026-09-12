// import { Uuid } from "@libs/common";
import { type } from "arktype";

export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;
export const ProductStatus = type.enumerated(...Object.values(PRODUCT_STATUS));
export type ProductStatus = typeof ProductStatus.infer;

// export const CreateProduct = type({
//   name: "string <= 255",
//   "description?": "string <= 255",
//   sku: "string.alphanumeric <= 10",
//   price: "number >= 0",
//   "status?": ProductStatus,
//   categoryId: Uuid,
// });
// export type CreateProduct = typeof CreateProduct.infer;

// export const ProductResponse = type({
//   id: "string.uuid",
//   createdAt: "string",
//   updatedAt: "string",
//   categoryId: "string.uuid",
//   name: "string",
//   description: "string | null",
//   sku: "string",
//   price: "string.numeric.parse",
//   status: ProductStatus,
// });
// export type ProductResponse = typeof ProductResponse.infer;

// export const ProductListResponse = ProductResponse.array();

// export const Test = type({
//   status: "string",
//   name: "string",
//   randomType: "string",
//   price: "string.numeric.parse",
//   description: "string",
//   id: "string.uuid",
//   createdAt: "string",
//   updatedAt: "string",
//   category: "string",
// });
