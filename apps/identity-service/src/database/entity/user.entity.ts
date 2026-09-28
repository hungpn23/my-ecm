import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";

export const UserSchema = defineEntity({
  name: AGGREGATE_TYPE.USER,
  properties: useBaseProps({
    email: p.string().unique(),
    password: p.string().lazy().ref().hidden(),
  }),
});

export class User extends UserSchema.class {}
UserSchema.setClass(User);
