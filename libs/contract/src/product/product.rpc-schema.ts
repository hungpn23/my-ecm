import { type } from "arktype";

import { EntityResponseFromRpc } from "../shared/entity-response.rpc-schema";
import { Uuid } from "../shared/string.schema";
import { Product } from "./product.schema";

export const GetProductsByIds = type({ ids: Uuid.array().atLeastLength(1).atMostLength(100) });
export type GetProductsByIds = typeof GetProductsByIds.infer;

export const ProductFromRpc = Product.merge(EntityResponseFromRpc);

export const ProductsFromRpc = ProductFromRpc.array().atMostLength(100);
