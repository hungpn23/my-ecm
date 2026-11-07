import { Endpoint } from "@libs/common";
import { Checkout, ConfirmCheckout, CreateCheckout, Order, PayCheckoutResponse, Uuid } from "@libs/contract";
import { Can } from "@nestjs/authorization";
import { Body, Controller, Param } from "@nestjs/common";

import { CheckoutService } from "./checkout.service";

@Can.Anyone()
@Controller("checkouts")
export class CheckoutController {
  constructor(private readonly checkout: CheckoutService) {}

  @Endpoint("POST", { request: CreateCheckout, response: Checkout })
  async create(@Body({ schema: CreateCheckout }) body: CreateCheckout): Promise<Checkout> {
    return await this.checkout.create(body);
  }

  @Endpoint("POST", { path: ":id/pay", response: PayCheckoutResponse })
  async pay(@Param("id", { schema: Uuid }) id: Uuid): Promise<PayCheckoutResponse> {
    return await this.checkout.pay(id);
  }

  @Endpoint("POST", { path: ":id/confirm", request: ConfirmCheckout, response: Order })
  async confirm(
    @Param("id", { schema: Uuid }) id: Uuid,
    @Body({ schema: ConfirmCheckout }) body: ConfirmCheckout,
  ): Promise<Order> {
    return await this.checkout.confirm(id, body);
  }

  @Endpoint("GET", { path: ":id", response: Checkout })
  async findOne(@Param("id", { schema: Uuid }) id: Uuid): Promise<Checkout> {
    return await this.checkout.findOne(id);
  }
}
