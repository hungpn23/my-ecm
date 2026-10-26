import type { Address, Addresses, CreateAddress, EditAddress, SuccessResponse, Uuid } from "@libs/contract";
import { LockMode } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

import { AddressEntity, UserEntity } from "#internal/database/entity/index";

@Injectable()
export class AddressService {
  constructor(
    private readonly em: EntityManager,
    private readonly authContext: AuthenticationContext,
  ) {}

  async findAll(): Promise<Addresses> {
    const addresses = await this.em.find(
      AddressEntity,
      { user: this.authContext.requireUser().id },
      {
        orderBy: { isDefault: "DESC", createdAt: "DESC", id: "DESC" },
      },
    );

    return { addresses: addresses.map((address) => address.toResponse()) };
  }

  async create(body: CreateAddress): Promise<Address> {
    return await this.em.transactional(async (em) => {
      const user = await this._getLockedUser(em);
      const count = await em.count(AddressEntity, { user });
      const address = em.create(AddressEntity, { ...body, user, isDefault: count === 0 });

      await em.flush();

      return address.toResponse();
    });
  }

  async setDefault(id: Uuid): Promise<Address> {
    return await this.em.transactional(async (em) => {
      const user = await this._getLockedUser(em);

      const address = await em.findOneOrFail(AddressEntity, { id, user });
      if (address.isDefault) return address.toResponse();

      await em.nativeUpdate(AddressEntity, { user, isDefault: true }, { isDefault: false });
      address.isDefault = true;

      await em.flush();

      return address.toResponse();
    });
  }

  async edit(id: Uuid, body: EditAddress): Promise<Address> {
    return await this.em.transactional(async (em) => {
      const user = await this._getLockedUser(em);
      const address = await em.findOneOrFail(AddressEntity, { id, user });

      em.assign(address, body);

      await em.flush();

      return address.toResponse();
    });
  }

  async remove(id: Uuid): Promise<SuccessResponse> {
    await this.em.transactional(async (em) => {
      const user = await this._getLockedUser(em);

      const address = await em.findOneOrFail(AddressEntity, { id, user });
      if (address.isDefault) await this._replaceDefault(em, address);

      em.remove(address);
    });

    return { ok: true };
  }

  private async _getLockedUser(em: EntityManager): Promise<UserEntity> {
    return await em.findOneOrFail(
      UserEntity,
      { id: this.authContext.requireUser().id },
      { lockMode: LockMode.PESSIMISTIC_WRITE },
    );
  }

  private async _replaceDefault(em: EntityManager, address: AddressEntity): Promise<void> {
    const replacement = await em.findOne(
      AddressEntity,
      { user: address.user.id, id: { $ne: address.id } },
      {
        orderBy: { createdAt: "DESC", id: "DESC" },
      },
    );
    if (replacement) replacement.isDefault = true;
  }
}
