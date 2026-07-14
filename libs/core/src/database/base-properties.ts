import { v7 } from "uuid";
import { p } from "@mikro-orm/core";

export const baseProperties = {
  id: p
    .uuid()
    .primary()
    .onCreate(() => v7()),
  createdAt: p.datetime().onCreate(() => new Date()),
  updatedAt: p
    .datetime()
    .onCreate(() => new Date())
    .onUpdate(() => new Date()),
};
