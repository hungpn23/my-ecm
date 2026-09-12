// import { UuidSchema } from "@libs/common";
import { type } from "arktype";

export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;
export const ProductStatusSchema = type.enumerated(...Object.values(PRODUCT_STATUS));
export type ProductStatus = typeof ProductStatusSchema.infer;

// export const CreateProductSchema = type({
//   name: "string <= 255",
//   "description?": "string <= 255",
//   sku: "string.alphanumeric <= 10",
//   price: "number >= 0",
//   "status?": ProductStatusSchema,
//   categoryId: UuidSchema,
// });
// export type CreateProduct = typeof CreateProductSchema.infer;

// export const ProductResponseSchema = type({
//   id: "string.uuid",
//   createdAt: "string",
//   updatedAt: "string",
//   categoryId: "string.uuid",
//   name: "string",
//   description: "string | null",
//   sku: "string",
//   price: "string.numeric.parse",
//   status: ProductStatusSchema,
// });
// export type ProductResponse = typeof ProductResponseSchema.infer;

// export const ProductListResponseSchema = ProductResponseSchema.array();

// export const TestSchema = type({
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
