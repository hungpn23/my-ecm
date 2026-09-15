import { EntityResponse, NonNegativeDecimal, Paginated, Uuid, Varchar } from "@libs/common";
import { type } from "arktype";

export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;
const ProductStatus = type.enumerated(...Object.values(PRODUCT_STATUS));

export const CreateProduct = type({
  name: Varchar,
  "description?": "string >= 1",
  price: NonNegativeDecimal,
  status: ProductStatus.default(PRODUCT_STATUS.ACTIVE),
  categoryId: Uuid,
});
export type CreateProduct = typeof CreateProduct.infer;

export const UpdateProduct = CreateProduct.partial().merge({
  "description?": "string >= 1 | null",
});
export type UpdateProduct = typeof UpdateProduct.infer;

export const ProductResponse = EntityResponse.merge({
  name: Varchar,
  description: "string | null",
  price: NonNegativeDecimal,
  status: ProductStatus,
  categoryId: Uuid,
});
export type ProductResponse = typeof ProductResponse.inferIn;

export const PaginatedProductResponse = Paginated(ProductResponse);
export type PaginatedProductResponse = typeof PaginatedProductResponse.inferIn;
