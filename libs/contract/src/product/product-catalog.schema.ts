import { type } from "arktype";

import { NonNegativeDecimal, OffsetQuery, Uuid } from "../shared/common.schema";

export const PRODUCT_CATALOG_SORT = ["newest", "price_asc", "price_desc", "name_asc"] as const;
export const ProductCatalogSort = type.enumerated(...PRODUCT_CATALOG_SORT);
export type ProductCatalogSort = typeof ProductCatalogSort.infer;

export const ProductCatalogQuery = OffsetQuery.merge({
  "categoryId?": Uuid,
  minPrice: NonNegativeDecimal.default("0.00"),
  maxPrice: NonNegativeDecimal.default("9999999999.99"),
  sort: ProductCatalogSort.default("newest"),
}).narrow((query, ctx) => {
  if (Number(query.minPrice) > Number(query.maxPrice)) {
    return ctx.reject({
      expected: "less than or equal to maxPrice",
      actual: query.minPrice,
      path: ["minPrice"],
    });
  }

  return true;
});
export type ProductCatalogQuery = typeof ProductCatalogQuery.infer;
