import { type } from "arktype";

export const DateValue = type("Date").or("string.date.iso.parse");
export type DateValue = typeof DateValue.infer;
