import type { Address, GetAddressById } from "@libs/contract";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import { AddressEntity } from "#internal/database/entity/index";

@Injectable()
export class AddressRpcService {
  constructor(private readonly em: EntityManager) {}

  async findOne({ addressId, userId }: GetAddressById): Promise<Address | null> {
    const em = this.em.fork();
    const address = await em.findOne(AddressEntity, { id: addressId, user: userId });

    return address?.toResponse() ?? null;
  }
}
