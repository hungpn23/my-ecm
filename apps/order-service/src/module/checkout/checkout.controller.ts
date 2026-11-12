import { Endpoint } from "@libs/common";
import { Checkout, ConfirmCheckout, OpenCheckout, Order, ProcessPaymentResponse, Uuid } from "@libs/contract";
import { Can } from "@nestjs/authorization";
import { Body, Controller, Param } from "@nestjs/common";

import { CheckoutService } from "./checkout.service";

@Controller("checkouts")
export class CheckoutController {
  constructor(private readonly checkout: CheckoutService) {}

  @Can.Anyone()
  @Endpoint("POST", { path: "open", request: OpenCheckout, response: Checkout })
  async open(@Body({ schema: OpenCheckout }) body: OpenCheckout): Promise<Checkout> {
    return await this.checkout.open(body);
  }

  @Can.Anyone()
  @Endpoint("POST", { path: ":checkoutId/process-payment", response: ProcessPaymentResponse })
  async processPayment(@Param("checkoutId", { schema: Uuid }) checkoutId: Uuid): Promise<ProcessPaymentResponse> {
    return await this.checkout.processPayment(checkoutId);
  }

  @Can.Anyone()
  @Endpoint("POST", { path: ":checkoutId/confirm", request: ConfirmCheckout, response: Order })
  async confirm(
    @Param("checkoutId", { schema: Uuid }) checkoutId: Uuid,
    @Body({ schema: ConfirmCheckout }) body: ConfirmCheckout,
  ): Promise<Order> {
    return await this.checkout.confirm(checkoutId, body);
  }

  @Can.Anyone()
  @Endpoint("GET", { path: ":checkoutId", response: Checkout })
  async findById(@Param("checkoutId", { schema: Uuid }) checkoutId: Uuid): Promise<Checkout> {
    return await this.checkout.findById(checkoutId);
  }
}
