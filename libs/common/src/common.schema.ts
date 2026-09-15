import { type } from "arktype";

export const Uuid = type("string.uuid.v7");
export const Varchar = type("string <= 255");
export const NonNegativeDecimal = type(/^(?:0|[1-9]\d{0,9})\.\d{2}$/).describe(
  "a non-negative decimal with up to 10 integer digits and exactly 2 fractional digits",
);
export const DateToISOString = type("Date").pipe(
  (date) => date.toISOString(),
  type("string.date.iso").configure({ format: "date-time" }),
);

export const AnyRecord = type.Record("string", "unknown");

export const OffsetQuery = type({
  "search?": Varchar,
  page: type("string.integer.parse").to("number >= 1").default("1"),
  pageSize: type("string.integer.parse").to("10 <= number <= 100 % 10").default("10"),
});
export type OffsetQuery = typeof OffsetQuery.infer;

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
