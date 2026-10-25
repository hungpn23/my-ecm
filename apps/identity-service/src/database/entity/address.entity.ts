import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";

import { UserEntity } from "./user.entity";

export const AddressSchema = defineEntity({
  name: AGGREGATE_TYPE.ADDRESS,
  properties: useBaseProps({
    user: () => p.manyToOne(UserEntity).lazyRef().inversedBy("addresses"),
    recipientName: p.string(),
    phone: p.string(),
    address: p.text(),
    isDefault: p.boolean(),
  }),
});

export class AddressEntity extends AddressSchema.class {}
AddressSchema.setClass(AddressEntity);
