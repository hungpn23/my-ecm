import { type } from "arktype";

import { Varchar255 } from "./string.schema";

export const AnyRecord = type.Record("string", "unknown");
export type AnyRecord = typeof AnyRecord.infer;

export const OffsetQuery = type({
  "search?": Varchar255,
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
