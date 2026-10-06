import { type } from "arktype";
import {
  NonEmptyString,
  NonNegativeDecimal,
  Paginated,
  Uuid,
  Varchar255,
} from "../shared/common.schema";
import { EntityResponse } from "../shared/entity-response.schema";

const PRODUCT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
const ProductStatus = type.enumerated(...Object.values(PRODUCT_STATUS));
export type ProductStatus = typeof ProductStatus.infer;

export const CreateProduct = type({
  name: Varchar255,
  "description?": NonEmptyString,
  price: NonNegativeDecimal,
  status: ProductStatus.default("ACTIVE"),
  categoryId: Uuid,
});
export type CreateProduct = typeof CreateProduct.infer;

export const UpdateProduct = CreateProduct.partial().merge({
  "description?": NonEmptyString.or("null"),
});
export type UpdateProduct = typeof UpdateProduct.infer;

const ProductResponse = EntityResponse.merge({
  name: Varchar255,
  price: NonNegativeDecimal,
  status: ProductStatus,
  categoryId: Uuid,
  shopId: Uuid,
});
export type ProductResponse = typeof ProductResponse.inferIn;

export const ProductDetailResponse = ProductResponse.merge({
  description: "string | null",
});
export type ProductDetailResponse = typeof ProductDetailResponse.inferIn;

export const PaginatedProductResponse = Paginated(ProductResponse);
export type PaginatedProductResponse = typeof PaginatedProductResponse.inferIn;
