import { type } from "arktype";

export const UuidSchema = type("string.uuid.v7");
export const VarcharSchema = type("string <= 255");

export const OffsetMetadataSchema = type({
  page: "number >= 1",
  pageSize: "number >= 10",
  total: "number >= 0",
  totalPages: "number >= 1",
});

export const Paginated = type("<t>", {
  data: "t[]",
  metadata: OffsetMetadataSchema,
});
