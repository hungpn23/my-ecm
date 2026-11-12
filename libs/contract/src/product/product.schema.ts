import { type } from "arktype";

import { ProductStock, Stock } from "../inventory/stock.schema";
import { Paginated } from "../shared/common.schema";
import { EntityResponse } from "../shared/entity-response.schema";
import { NonNegativeDecimal } from "../shared/number.schema";
import { NonEmptyString, Uuid, Varchar255 } from "../shared/string.schema";

export const PRODUCT_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export const ProductStatus = type.enumerated(...PRODUCT_STATUSES);
export type ProductStatus = typeof ProductStatus.infer;

export const CreateProduct = type({
  name: Varchar255,
  "description?": NonEmptyString,
  price: NonNegativeDecimal,
  status: ProductStatus.default("ACTIVE"),
  categoryId: Uuid,
}).merge(Stock.pick("onHand"));
export type CreateProduct = typeof CreateProduct.infer;

export const UpdateProduct = CreateProduct.omit("onHand")
  .partial()
  .merge({
    "description?": NonEmptyString.or("null"),
  });
export type UpdateProduct = typeof UpdateProduct.infer;

export const Product = EntityResponse.merge({
  name: Varchar255,
  price: NonNegativeDecimal,
  status: ProductStatus,
  categoryId: Uuid,
  shopId: Uuid,
});
export type Product = typeof Product.inferIn;

export const ProductDetail = Product.merge({
  description: "string | null",
});
export type ProductDetail = typeof ProductDetail.inferIn;

export const CreateProductResponse = ProductDetail.merge({ stock: ProductStock });
export type CreateProductResponse = typeof CreateProductResponse.inferIn;

export const PaginatedProductResponse = Paginated(Product);
export type PaginatedProductResponse = typeof PaginatedProductResponse.inferIn;
