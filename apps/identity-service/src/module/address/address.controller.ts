import { Endpoint } from "@libs/common";
import { Address, Addresses, CreateAddress, EditAddress, SuccessResponse, Uuid } from "@libs/contract";
import { Can } from "@nestjs/authorization";
import { Body, Controller, Param } from "@nestjs/common";

import { AddressService } from "./address.service";

@Controller("addresses")
export class AddressController {
  constructor(private readonly address: AddressService) {}

  @Can.Anyone()
  @Endpoint("GET", { response: Addresses })
  async findAll(): Promise<Addresses> {
    return await this.address.findAll();
  }

  @Can.Anyone()
  @Endpoint("POST", { request: CreateAddress, response: Address })
  async create(@Body({ schema: CreateAddress }) body: CreateAddress): Promise<Address> {
    return await this.address.create(body);
  }

  @Can.Anyone()
  @Endpoint("PATCH", { path: ":addressId/default", response: Address })
  async setDefault(@Param("addressId", { schema: Uuid }) addressId: Uuid): Promise<Address> {
    return await this.address.setDefault(addressId);
  }

  @Can.Anyone()
  @Endpoint("PATCH", { path: ":addressId", request: EditAddress, response: Address })
  async edit(
    @Param("addressId", { schema: Uuid }) addressId: Uuid,
    @Body({ schema: EditAddress }) body: EditAddress,
  ): Promise<Address> {
    return await this.address.edit(addressId, body);
  }

  @Can.Anyone()
  @Endpoint("DELETE", { path: ":addressId", response: SuccessResponse })
  async remove(@Param("addressId", { schema: Uuid }) addressId: Uuid): Promise<SuccessResponse> {
    return await this.address.remove(addressId);
  }
}
