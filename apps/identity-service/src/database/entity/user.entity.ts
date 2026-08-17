import { baseProperties } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";

export const UserSchema = defineEntity({
  name: "User",
  properties: {
    ...baseProperties,
    email: p.string().unique(),
    password: p.string().lazy().ref(),
  },
});

export class User extends UserSchema.class {}
UserSchema.setClass(User);
