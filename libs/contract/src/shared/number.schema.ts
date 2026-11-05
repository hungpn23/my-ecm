import { type } from "arktype";

export const NonNegativeInteger = type("number.integer >= 0");
export type NonNegativeInteger = typeof NonNegativeInteger.infer;

export const NonNegativeDecimal = type(/^(?:0|[1-9]\d{0,9})\.\d{2}$/)
  .brand("NonNegativeDecimal")
  .describe("a non-negative decimal with up to 10 integer digits and exactly 2 fractional digits");
export type NonNegativeDecimal = typeof NonNegativeDecimal.infer;
