import { type Address, GetAddressById } from "@libs/contract";
import type { MicroserviceCommand } from "@libs/core";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { AddressRpcService } from "./address.rpc-service";

@Controller()
export class AddressConsumer {
  constructor(private readonly address: AddressRpcService) {}

  @MessagePattern<MicroserviceCommand>("get.address.by-id")
  async getAddress(@Payload({ schema: GetAddressById }) payload: GetAddressById): Promise<Address | null> {
    return await this.address.findOne(payload);
  }
}
