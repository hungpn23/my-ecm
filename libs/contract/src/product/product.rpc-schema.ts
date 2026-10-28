import { type } from "arktype";

import { EntityRpcResponse } from "../shared/entity-response.rpc-schema";
import { Uuid } from "../shared/string.schema";
import { Product } from "./product.schema";

export const GetProductsByIds = type({ ids: Uuid.array().atLeastLength(1).atMostLength(100) });
export type GetProductsByIds = typeof GetProductsByIds.infer;

export const ProductRpc = Product.merge(EntityRpcResponse);
export type ProductRpc = typeof ProductRpc.infer;

export const ProductsRpc = ProductRpc.array().atLeastLength(1).atMostLength(100);
export type ProductsRpc = typeof ProductsRpc.infer;
