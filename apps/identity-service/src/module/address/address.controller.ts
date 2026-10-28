import { Endpoint } from "@libs/common";
import { Address, Addresses, CreateAddress, EditAddress, SuccessResponse, Uuid } from "@libs/contract";
import { Can } from "@nestjs/authorization";
import { Body, Controller, Param } from "@nestjs/common";

import { AddressService } from "./address.service";

@Can.Anyone()
@Controller("addresses")
export class AddressController {
  constructor(private readonly address: AddressService) {}

  @Endpoint("GET", { response: Addresses })
  async findAll(): Promise<Addresses> {
    return await this.address.findAll();
  }

  @Endpoint("POST", { request: CreateAddress, response: Address })
  async create(@Body({ schema: CreateAddress }) body: CreateAddress): Promise<Address> {
    return await this.address.create(body);
  }

  @Endpoint("PATCH", { path: ":id/default", response: Address })
  async setDefault(@Param("id", { schema: Uuid }) id: Uuid): Promise<Address> {
    return await this.address.setDefault(id);
  }

  @Endpoint("PATCH", { path: ":id", request: EditAddress, response: Address })
  async edit(
    @Param("id", { schema: Uuid }) id: Uuid,
    @Body({ schema: EditAddress }) body: EditAddress,
  ): Promise<Address> {
    return await this.address.edit(id, body);
  }

  @Endpoint("DELETE", { path: ":id", response: SuccessResponse })
  async remove(@Param("id", { schema: Uuid }) id: Uuid): Promise<SuccessResponse> {
    return await this.address.remove(id);
  }
}
