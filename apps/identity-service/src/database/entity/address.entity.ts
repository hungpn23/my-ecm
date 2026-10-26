import type { Address } from "@libs/contract";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p, wrap } from "@mikro-orm/core";

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

export class AddressEntity extends AddressSchema.class {
  toResponse(this: AddressEntity): Address {
    return wrap(this).serialize({ exclude: ["user"] });
  }
}
AddressSchema.setClass(AddressEntity);
