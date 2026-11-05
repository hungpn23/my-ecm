import { Module } from "@nestjs/common";

import { AddressConsumer } from "./address.consumer";
import { AddressController } from "./address.controller";
import { AddressRpcService } from "./address.rpc-service";
import { AddressService } from "./address.service";

@Module({
  controllers: [AddressController, AddressConsumer],
  providers: [AddressService, AddressRpcService],
})
export class AddressModule {}
