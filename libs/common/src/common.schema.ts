import { type } from "arktype";

export const Uuid = type("string.uuid.v7");
export const Varchar = type("string <= 255");
export const NonNegativeDecimal = type(/^(?:0|[1-9]\d{0,9})\.\d{2}$/).describe(
  "a non-negative decimal with up to 10 integer digits and exactly 2 fractional digits",
);

export const OffsetMetadata = type({
  page: "number.integer >= 1",
  pageSize: "number.integer >= 10",
  total: "number.integer >= 0",
  totalPages: "number.integer >= 1",
});

export const Paginated = type("<t>", {
  data: "t[]",
  metadata: OffsetMetadata,
});
