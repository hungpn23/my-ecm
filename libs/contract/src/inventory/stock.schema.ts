import { type } from "arktype";

import { POSTGRES_INTEGER_MAX } from "../shared/common.constant";
import { EntityHttpResponse } from "../shared/entity-response.schema";
import { NonNegativeInteger } from "../shared/number.schema";
import { Uuid } from "../shared/string.schema";

const StockQuantity = NonNegativeInteger.atMost(POSTGRES_INTEGER_MAX);

export const Stock = EntityHttpResponse.merge({
  productId: Uuid,
  shopId: Uuid,
  onHand: StockQuantity,
  reserved: StockQuantity,
  available: StockQuantity,
});
export type Stock = typeof Stock.inferIn;

export const AvailabilityQuery = type({ productId: Uuid });
export type AvailabilityQuery = typeof AvailabilityQuery.infer;

export const Availability = Stock.omit("shopId", "onHand", "reserved");
export type Availability = typeof Availability.inferIn;
