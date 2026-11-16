import { type } from "arktype";

import { Uuid } from "../shared/string.schema";
import { Product } from "./product.schema";

export const GetProductsByIds = type({ productIds: Uuid.array().atLeastLength(1).atMostLength(100) });
export type GetProductsByIds = typeof GetProductsByIds.infer;

export const Products = Product.array().atMostLength(100);
