import { ConfirmPayment, CreatePayment, type Payment } from "@libs/contract";
import type { MicroserviceCommand } from "@libs/core";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { PaymentRpcService } from "./payment.rpc-service";

@Controller()
export class PaymentConsumer {
  constructor(private readonly payment: PaymentRpcService) {}

  @MessagePattern<MicroserviceCommand>("create.payment")
  async create(@Payload({ schema: CreatePayment }) payload: CreatePayment): Promise<Payment> {
    return await this.payment.create(payload);
  }

  @MessagePattern<MicroserviceCommand>("confirm.payment")
  async confirm(@Payload({ schema: ConfirmPayment }) payload: ConfirmPayment): Promise<Payment> {
    return await this.payment.confirm(payload);
  }
}
