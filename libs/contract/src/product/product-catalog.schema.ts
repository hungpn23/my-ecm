import { type } from "arktype";

import { NonNegativeDecimal, OffsetQuery, Uuid } from "../shared/common.schema";

export const PRODUCT_CATALOG_SORT = ["newest", "price_asc", "price_desc", "name_asc"] as const;
export const ProductCatalogSort = type.enumerated(...PRODUCT_CATALOG_SORT);
export type ProductCatalogSort = typeof ProductCatalogSort.infer;

export const ProductCatalogQuery = OffsetQuery.merge({
  "categoryId?": Uuid,
  "minPrice?": NonNegativeDecimal,
  "maxPrice?": NonNegativeDecimal,
  sort: ProductCatalogSort.default("newest"),
});
export type ProductCatalogQuery = typeof ProductCatalogQuery.infer;
