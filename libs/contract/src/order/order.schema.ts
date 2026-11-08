import { type } from "arktype";

import { EntityResponse } from "../shared/entity-response.schema";
import { Uuid } from "../shared/string.schema";

export const ORDER_STATUSES = ["READY_TO_SHIP", "PROCESSED", "SHIPPED", "TO_CONFIRM_RECEIVE", "COMPLETED"] as const;
export const OrderStatus = type.enumerated(...ORDER_STATUSES);
export type OrderStatus = typeof OrderStatus.infer;

export const Order = EntityResponse.merge({ checkoutId: Uuid, status: OrderStatus });
export type Order = typeof Order.inferIn;
