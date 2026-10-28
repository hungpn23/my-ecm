import { type } from "arktype";

export const DateToISOString = type("Date").pipe(
  (date) => date.toISOString(),
  type("string.date.iso").configure({ format: "date-time" }),
);
export type DateToISOString = typeof DateToISOString.infer;

export const DateFromISOString = type("string.date.iso.parse");
export type DateFromISOString = typeof DateFromISOString.infer;
